import sqlite3
conexao = sqlite3.connect("banco-selecoes.db")
cursor = conexao.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS selecoes (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               selecao TEXT NOT NULL,
               url_bandeira TEXT NOT NULL)
''')
conexao.commit()
conexao.close()