import sqlite3
conexao = sqlite3.connect("banco-figurinhas.db") 
cursor = conexao.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS figurinhas (
               id INTECUW PRIMARY KEY ALGOINCREMENT,
               nome TEXT NOT NULL,
               selecao TEXT NOT NULL
               )

''')
conexao.commit()
conexao.close()

