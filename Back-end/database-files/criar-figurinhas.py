import sqlite3
conexao = sqlite3.connect("banco-figurinhas.db") 
cursor = conexao.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS figurinhas (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               nome TEXT NOT NULL,
               selecao TEXT NOT NULL
               )

''')
figurinhas =[
    ('CC1', 'Coca-Cola'),
    ('CC2', 'Coca-Cola'),
    ('CC3', 'Coca-Cola'),
    ('CC4', 'Coca-Cola'),
    ('CC5', 'Coca-Cola'),
    ('CC6', 'Coca-Cola'),
    ('CC7', 'Coca-Cola'),
    ('CC8', 'Coca-Cola'),
    ('CC9', 'Coca-Cola'),
    ('CC10', 'Coca-Cola'),
    ('CC11', 'Coca-Cola'),
    ('CC12', 'Coca-Cola'),
    ('CC13', 'Coca-Cola'),
    ('CC14', 'Coca-Cola')
]
cursor.executemany('INSERT INTO figurinhas (nome, selecao) VALUES (?,?)', figurinhas)
conexao.commit()
conexao.close()

