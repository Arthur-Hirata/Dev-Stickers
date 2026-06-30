import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os 
from dotenv import load_dotenv
import jwt
import datetime
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
app= Flask(__name__)
CORS(app)
load_dotenv(dotenv_path='.env')
SECRET_KEY = os.getenv("SECRET_KEY")


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
        with sqlite3.connect('banco-users.db') as conxexao:
            cursor = conxexao.cursor()
            cursor.execute("INSERT INTO users (email, nome, senha) VALUES (?,?,?)", (email, nome, senha_criptografada))
            conxexao.commit()
            user_id = cursor.lastrowid
        
        payload ={
            'sub' : user_id,
            'nome' : nome,
            'admin' : False,
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
            cursor.execute("SELECT id, senha, nome FROM users WHERE email=?", (email,))
            result = cursor.fetchone()
        if result is None:
            return jsonify({"mensagem" : "Usuário não encontrado"}), 404
        user_id, user_password, user_name= result

        if check_password_hash(user_password, senha):
            horas_expiracao = 24 if remember else 1
            tempo_expiracao = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=horas_expiracao)

            payload={
                'sub' : user_id,
                'nome' : user_name,
                'admin' : False,
                'exp' : tempo_expiracao
            }
            token_JWT = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
            return jsonify({
                'mensagem' : 'Login bem-sucedido',
                'token_JWT' : token_JWT
            }), 200

            
        else:
            return jsonify({"mensagem": "Senha incorreta"}), 401


    except sqlite3.Error as e:
        return jsonify({"mensagem" : "Erro no banco de dados"}), 500
        
        






if __name__ == '__main__':
    app.run(debug=True)