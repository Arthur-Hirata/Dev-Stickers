import sqlite3
conexao = sqlite3.connect("banco-figurinhas.db") 
cursor = conexao.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS figurinhas (
               id INTEGRER PRIMARY KEY AUTOINCREMENT,
               nome TEXT NOT NULL,
               selecao TEXT NOT NULL
               )

''')
selec = "EUA"
cursor.execute("UPDATE figurinhas SET selecao =? WHERE id BETWEEN ? AND ?", (selec, 275, 294))
conexao.commit()
conexao.close()

