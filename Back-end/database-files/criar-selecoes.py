import sqlite3
conexao = sqlite3.connect("banco-selecoes.db")
cursor = conexao.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS selecoes (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               selecao TEXT NOT NULL,
               url_bandeira TEXT NOT NULL,
               grupo TEXT)
''')
grupo_A = [
    ('México', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJnm5HLbREuXMvOzMXWobYgHfLFpAi3v1J2b1d4SroLQ&s', 'Grupo A'),
    ('Coreia do Sul', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4kvBDum_l0NSP1v5PX-PHMAaBuUU7e78_ol3kiT1dNg&s=10', 'Grupo A'),
    ('Tchéquia', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIbiPM0QYxuYXw91OPQEkCCZDoBJ9zyUbFZ-HZWHbD7w&s=10', 'Grupo A'),
    ('África do Sul', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYwiMwQuQBHif3h3Jdag1OyRGiVjIFmZkTuCSZ537h3A&s=10', 'Grupo A')
]
#cursor.executemany("INSERT INTO selecoes (selecao, url_bandeira, grupo) VALUES (?,?,?)", grupo_A)
conexao.commit()
conexao.close()