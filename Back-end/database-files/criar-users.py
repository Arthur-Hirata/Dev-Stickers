import sqlite3
conexao = sqlite3.connect("banco-users.db")
cursor = conexao.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               email TEXT NOT NULL,
               nome TEXT NOT NULL,
               senha TEXT NOT NULL, 
               figurinhas TEXT       
               )
''')
conexao.commit()
conexao.close()