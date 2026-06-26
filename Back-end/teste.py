import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
app= Flask(__name__)
CORS(app)

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
        print(e)
        return jsonify({"mensagem" : "Fail request"}), 500
    
    return jsonify({"mensagem" : "sucess", 'dados' : lista_figurinhas})


if __name__ == '__main__':
    app.run(debug=True)