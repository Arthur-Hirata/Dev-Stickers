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
grupo = [
    ('Inglaterra', 'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg', 'Grupo L'),
    ('Croácia', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Flag_of_Croatia.svg/1280px-Flag_of_Croatia.svg.png', 'Grupo L'),
    ('Gana', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/330px-Flag_of_Ghana.svg.png', 'Grupo L'),
    ('Panamá', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/330px-Flag_of_Panama.svg.png', 'Grupo L')
]
#cursor.executemany("INSERT INTO selecoes (selecao, url_bandeira, grupo) VALUES (?,?,?)", grupo)
id = "24"
nome = "C. Marfim"
cursor.execute("UPDATE selecoes SET selecao =? WHERE id=?", (nome, id,))

conexao.commit()
conexao.close()