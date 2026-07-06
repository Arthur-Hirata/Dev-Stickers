import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
import jwt
import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
app= Flask(__name__)
CORS(app)
load_dotenv(dotenv_path='.env')
SECRET_KEY = os.getenv("SECRET_KEY")

@app.route('/verifyIdentity', methods=['GET'])
def verificarUsuario():
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem": "Token ausente!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token,SECRET_KEY, algorithms=['HS256'])

        return jsonify({
            "mensagem" : "Token válido",
            "nome" : payload['nome']
        }), 200
    except jwt.ExpiredSignatureError as e:
        print(f"Erro detectado: O token realmente expirou! Detalhes: {e}")
        return jsonify({"mensagem" : "Token expirado!"}), 401
        
    except jwt.InvalidTokenError as e:
        print(f"Erro detectado: Assinatura ou chave inválida! Detalhes: {e}")
        return jsonify({"mensagem" : "Token inválido!"}), 401

@app.route('/getGroups', methods=['POST'])
def pegarGrupos():
    try:
        with sqlite3.connect("banco-selecoes.db") as conexao:
            cursor= conexao.cursor()
            cursor.execute("SELECT selecao, url_bandeira, grupo FROM selecoes")
            resultado = cursor.fetchall()

            lista_selecoes =[]
            for linha in resultado:
                lista_selecoes.append({
                    'pais' : linha[0],
                    'bandeira' : linha[1],
                    'grupo': linha[2]
                })        


    except sqlite3.Error as e:
        return jsonify({"mensagem": "Erro no banco de dados"}), 500
    return jsonify({'mensagem' : 'Busca bem sucedida!', 'dados' : lista_selecoes})
@app.route('/getStickers', methods=['POST'])
def pegarFigurinhas():
    dados = request.json
    selecao = dados.get('selecao')
    auth_header = request.headers.get('Authorization')
    user_id = None
    if auth_header and " " in auth_header:
        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token,SECRET_KEY, algorithms=['HS256'])
            user_id = payload['sub']
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
            pass
    try:
        with sqlite3.connect('banco-figurinhas.db') as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome FROM figurinhas WHERE selecao=?", (selecao,))
            resutl = cursor.fetchall()

        lista_figurinhas = []
        for linha in resutl:
            lista_figurinhas.append({
                'id' : linha[0],
                'nome' : linha[1]
            })
    
    except sqlite3.Error as e:
        return jsonify({"mensagem" : "Fail request"}), 500
    
    return jsonify({"mensagem" : "sucess", 'dados' : lista_figurinhas})
@app.route('/createUser', methods=['POST'])
def criarUser():
    dados= request.json
    email= dados.get('email')
    nome= dados.get('nome')
    senha= dados.get('senha')
    senha_criptografada = generate_password_hash(senha)
    try:
        with sqlite3.connect('banco-users.db') as conexao:
            cursor = conexao.cursor()
            cursor.execute("INSERT INTO users (email, nome, senha) VALUES (?,?,?)", (email, nome, senha_criptografada))
            conexao.commit()
            user_id = cursor.lastrowid
        
        payload ={
            'sub' : str(user_id),
            'nome' : nome,
            'admin' : "user",
            'exp' : datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=10)
        }
        token_JWT = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    
    except sqlite3.Error as e:
        return jsonify({"mensagem": "Erro no banco de dados"}), 500
    return jsonify({"mensagem" : "Usuário adicionado com sucesso", "JWT_token": token_JWT})

@app.route('/loginUser', methods=['POST'])
def loginUser():
    dados = request.json
    email = dados.get('email')
    senha = dados.get('senha')
    remember = dados.get('remember')
    try:
        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, senha, nome, role FROM users WHERE email=?", (email,))
            result = cursor.fetchone()
        if result is None:
            return jsonify({"mensagem" : "Usuário não encontrado"}), 404
        user_id, user_password, user_name, user_role= result

        if check_password_hash(user_password, senha):
            horas_expiracao = 24 if remember else 1
            tempo_expiracao = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=horas_expiracao)

            payload={
                'sub' : str(user_id),
                'nome' : user_name,
                'admin' : user_role,
                'exp' : tempo_expiracao
            }
            token_JWT = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return jsonify({
                'mensagem' : 'Login bem-sucedido',
                'JWT_token' : token_JWT
            }), 200

            
        else:
            return jsonify({"mensagem": "Senha incorreta"}), 401


    except sqlite3.Error as e:
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500
@app.route('/markSticker', methods=['POST'])
def marcarFigurinha():
    dados = request.json
    idFigurinha = dados.get('figId')
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    
    if not idFigurinha:
            return jsonify({"mensagem" : "ID da figurinha não enviado"}), 400
     
    with sqlite3.connect("banco-users.db") as conexao:
        cursor = conexao.cursor()
        cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
        resultado = cursor.fetchone()
    texto_no_banco= resultado[0] 
    figurinhas_lista = json.loads(texto_no_banco) if texto_no_banco else []    
    ja_existe = False
    for item in figurinhas_lista:
        if item['id'] == idFigurinha:
            ja_existe = True
            break

    if not ja_existe:
        figurinhas_lista.append({
            'id' : idFigurinha,
            'quantidade' : 1
        })
    cursor.execute("UPDATE users SET figurinhas =? WHERE id=?", (json.dumps(figurinhas_lista), user_id))
    conexao.commit()
    return jsonify({"mensagem" : "figurinha adicionada!", 'qnt' : "1"}), 200 

@app.route('/getUsersStickers', methods=['POST', 'GET'])
def pegar_figurinhas_do_usuário():
    dados = request.get_json(silent=True) or {}
    selecao = dados.get('selecao')
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    if not selecao:
        return jsonify({"mensagem" : "Seleção não informada!"}), 400
    
    try:
        with sqlite3.connect("banco-figurinhas.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome FROM figurinhas WHERE selecao =?", (selecao,))
            figurinhas = cursor.fetchall()

        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            user_figurinhas = cursor.fetchall()
        
        ids_do_usuario = {}
        if user_figurinhas and user_figurinhas[0][0]:
            try:
                lista_json = json.loads(user_figurinhas[0][0])
                ids_do_usuario = {
                    int(item["id"]) : int(item.get("quantidade", 1))
                    for item in lista_json
                    if isinstance(item, dict) and "id" in item
                }
            except (json.JSONDecodeError, TypeError, ValueError):
                ids_do_usuario = {}

        lista_faltantes = []
        lista_user=[]
        
        for fig_ID, fig_Nome in figurinhas:
            if fig_ID in ids_do_usuario:
                qnt = ids_do_usuario[fig_ID]
                dados_figurinhas = {'id': fig_ID, 'nome' : fig_Nome, 'quantidade': qnt }
                lista_user.append(dados_figurinhas)
            else :
                dados_figurinhas = {'id': fig_ID, 'nome' : fig_Nome, 'quantidade': 0 }
                lista_faltantes.append(dados_figurinhas)

        lista_user.sort(key=lambda x:x['id'])
        lista_faltantes.sort(key=lambda x: x['id'])
        return jsonify({
            'mensagem' : "Busca efetudada com sucesso!", 
            'marcadas' : lista_user,
            'faltantes' : lista_faltantes
        }), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500
    
@app.route('/increaseSticker', methods=['POST'])
def aumentarFigurinha():
    dados = request.get_json(silent=True) or {}
    figId = dados.get('figID')
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    try:
        with sqlite3.connect("banco-users.db") as conexao:
            cursor=conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            lista_user = cursor.fetchone()
            figurinhas_user=[]
            
            if lista_user and lista_user[0]:
                figurinhas_user = json.loads(lista_user[0])

                for figurinha in figurinhas_user:
                    if figurinha['id'] == figId:
                        figurinha['quantidade'] +=1
                        qnt = figurinha['quantidade']
                        break
                cursor.execute("UPDATE users SET figurinhas =? WHERE id= ?", (json.dumps(figurinhas_user), user_id,))
                conexao.commit()
                return jsonify({"mensagem": "Mudança efetuada com sucesso!", 'qnt' : qnt}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500

@app.route('/decreaseSticker', methods=['POST'])
def diminuirFigurinha():
    dados = request.get_json(silent=True) or {}
    figId = dados.get('figID')
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    try:
        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            lista_user = cursor.fetchone()
            figurinhas_user = []

            if lista_user and lista_user[0]:
                figurinhas_user = json.loads(lista_user[0])

                for figurinha in figurinhas_user:
                    if figurinha['id'] == figId:
                        figurinha['quantidade'] -= 1
                        qnt = figurinha['quantidade']
                        break
            cursor.execute("UPDATE users SET figurinhas = ? WHERE id=?", (json.dumps(figurinhas_user), user_id,))
            conexao.commit()
            return jsonify({"mensagem" : "Mudança efetuada com sucesso!", 'qnt' : qnt}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500
@app.route('/removeSticker', methods=['POST'])
def removerFigurinhas():
    dados = request.get_json(silent=True) or {}
    figId = dados.get('figID')

    if figId is not None:
        try:
            figId = int(figId)
        except ValueError:
            return jsonify({"mensagem": "ID da figurinha inválido!"}), 400
    else:
        return jsonify({"mensagem": "ID da figurinha não enviado!"}), 400

    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    

    try:
        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            lista_user = cursor.fetchone()

            lista_figurinhas = []

            if lista_user and lista_user[0]:
                lista_figurinhas = json.loads(lista_user[0])

            nova_lista = [figurinha for figurinha in lista_figurinhas if int(figurinha['id']) != figId]

            cursor.execute("UPDATE users SET figurinhas = ? WHERE id=?", (json.dumps(nova_lista), user_id,))
            conexao.commit()

        return jsonify({"mensagem": "Figurinha removida com sucesso!"}), 200


    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500
@app.route('/getMarkedStickres', methods=['POST'])
def pegarQuantidadeFaltante():
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    
    try:
        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            lista_user = cursor.fetchone()

            lista_figurinhas =[]
            if lista_user and lista_user[0]:
                lista_figurinhas = json.loads(lista_user[0])

            total_figurinhas = len(lista_figurinhas)
            return jsonify({"mensagem" : "Busca feita com sucesso!", 'total' : total_figurinhas}), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de dados!"}), 500

@app.route('/getDuplicate', methods=['GET'])
def pegarRepetidas():
    auth_header = request.headers.get('Authorization')
    if not auth_header or " " not in auth_header:
        return jsonify({"mensagem" : "Token expirado!"}), 401
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = payload['sub']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return jsonify({"mensagem": "Sessão expirada. Faça login novamente."}), 401
    try: 
        with sqlite3.connect("banco-figurinhas.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT id, nome FROM figurinhas")
            lista_fig = cursor.fetchall()

        with sqlite3.connect("banco-users.db") as conexao:
            cursor = conexao.cursor()
            cursor.execute("SELECT figurinhas FROM users WHERE id=?", (user_id,))
            lista_user  = cursor.fetchall()
        figurinhas_user =[]
        lista_repetidas = []
        if lista_user and lista_user[0]:
            try:
                lista_json = json.loads(lista_user[0][0])
                ids_do_usuario = {
                    int(item["id"]) : int(item.get("quantidade", 1))
                    for item in lista_json
                    if isinstance(item, dict) and "id" in item
                }
            except (json.JSONDecodeError, TypeError, ValueError):
                ids_do_usuario = {}
        
        for fig_ID, fig_Nome in lista_fig:
            if fig_ID in ids_do_usuario:
                qnt = ids_do_usuario[fig_ID]
                if qnt > 1:
                    dados_figurinhas = {"nome" : fig_Nome, 'quantidade' : qnt -1}
                    lista_repetidas.append(dados_figurinhas)

        return jsonify({
            "mensagem" : "Busca efetuada com sucesso!", 
            'repetidas' : lista_repetidas
        }), 200
    except sqlite3.Error as e:
        print(e)
        return jsonify({"mensagem" : "Erro no banco de daddos!"}), 500


if __name__ == '__main__':
    app.run(debug=True)