from flask import Flask,render_template,request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")


@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/calendrier')
def calendrier():
    return render_template("calendrier.html")
@app.route('/equipes')
def equipes():
    return render_template("equipes.html")
@app.route('/register')
def register():
    return render_template("register.html")

@app.route('/account-created',methods = ['POST'])
def account_created():
    result = request.form
    new_id = result['new_login']
    new_pwd = result['new_password']
    equipe_fav = request.form['equipe-fav']
    temps_de_jeu = request.form['temps-de-jeu']
    fav_game = request.form['fav-game']
    esport_familiarity = request.form['esport-familiarity']
    #Mettre le chemin d'accès complet si la .txt se trouve sur une clé USB....
    with open('static/database.txt', 'a', encoding='utf-8') as database:
        database.write(f'\n') #retour à la ligne pour que chaque identifiant soit bien sur une ligne différente ! sinon problème lors du login...
        database.write(f"{new_id},{new_pwd},{equipe_fav},{esport_familiarity},{fav_game},{temps_de_jeu}")
    
    return render_template("account-created.html",identifiant = new_id)

@app.route('/resultat',methods = ['POST'])
def resultat():
    result = request.form
    id = result['login']
    pwd = result['password']
    
    with open('static/database.txt','r', encoding='utf-8') as database:
        for ligne in database:
            if ligne.strip().startswith('//' or ''): #pour ne pas prendre en compte les commentaires ou les lignes vides (problèmes pouvant venir de la création de compte...)
                continue
            login,password,equipe_fav,esport_familiarity,fav_game,temps_de_jeu = ligne.strip().split(',')
            #team logo fct
            if equipe_fav == 'vitality' :
                team_logo = 'static/vit-logo.png'
            elif equipe_fav == 'c9':
                team_logo = 'static/c9.png'
            elif equipe_fav == 'faze':
                team_logo = 'static/faze.png'
            elif equipe_fav == 'nip':
                team_logo = 'static/nip.png'
            else: #no-fav-team
                team_logo = 'static/noteam_logo.png'   

    if login  == id and pwd == password:
        return render_template('resultat.html',identifiant = id, equipe_fav=equipe_fav,logo_equipe = team_logo,cs_fav_game=fav_game,tps_jeu=temps_de_jeu,esport_knowing=esport_familiarity)

    return render_template('error.html',identifiant = id)
    
@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/contacted',methods = ['GET'])
def contacted():
    result = request.args
    mess = result['message']
    mail = result['email']
    
    return render_template('contacted.html',adress_mail = mail, message = mess)

@app.route('/js')
def js():
    return render_template("js-image.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error_404.html')

app.run(debug=True)