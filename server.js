

var express     	= require('express');
var bodyParser 		= require('body-parser');
var path        	= require('path');
var app         	= express();
var mandrill 		= require('mandrill-api/mandrill');
var process 		= require('process');
var qs 				= require('querystring');

//Middleware Configs
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

//If you want to use view engines
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');

//Routes
app.get('/', (req, res) => res.render('index', {active_page: 'home'}));
app.get('/about', (req, res) => res.render('about', {active_page: 'about'}));
app.get('/services', (req, res) => res.render('services', {active_page: 'services'}));
app.get('/contact', (req, res) => res.render('contact', {active_page: 'contact'}));
//app.get('/about', (req, res) => res.render('about', {message: 'Great and nerdy things coming... stay tuned.', title: 'this is how you pass data from express to your views.', active_page: 'about-page'}));

app.post('/contact', (req, res)=>{
	let formData = qs.parse(req.body.data.data);
	console.log('formData: ', formData);

	let msg_html = `
		<p>Name: ${formData['first-name']} ${formData['last-name']}</p>
		<p>Email: ${formData['email']}</p>
		<p>Phone: ${formData['phone']}</p>
		<p>Reason for inquiry: ${formData['desc']}</p>
	`;
	msg_html = msg_html.trim();

	let MANDRILL_CONFIGS = {
		protocall: 'https',
		base_endpoint: 'mandrillapp.com/api/1.0/SOME-METHOD.OUTPUT_FORMAT',
		host: 'smtp.mandrillapp.com',
		port: 587,
		options: {
			service: 'Mandrill',
			auth: {
				user: '4th Generation Construction Inc.',
				pass: process.env.MAIL_KEY
			}
		}
	}


	var mandrill_client = new mandrill.Mandrill(MANDRILL_CONFIGS.options.auth.pass);

	var message = {
		"html": msg_html,
		"text": formData['desc'],
		"subject": "site contact",
		"from_email": 'ovi@4gconline.com',
		"from_name": formData['first-name'] + formData['last-name'],
		"to": [{
				"email": "ovi@4gconline.com",
				"name": "4GC",
				"type": "to"
			}],
		"headers": {
			"Reply-To": formData['email']
		},
		"important": false,
		"track_opens": null,
		"track_clicks": null,
		"auto_text": null,
		"auto_html": null,
		"inline_css": null,
		"url_strip_qs": null,
		"preserve_recipients": null,
		"view_content_link": null
	};

	var async = false;
	var ip_pool = "Main Pool";

	//YYYY-MM-DD HH:MM:SS
	var now 	= new Date();
	var send_at = '2011-01-01 12:00:00';
	mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool, "send_at": send_at}, (result) => {
		console.log(result);
		res.status(200).send(result);

	}, function(e) {
		// Mandrill returns the error as an object with name and message keys
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		// A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
		res.status(500).send('error');
	});
});

//Port Configs
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), () => console.log('Node app is running on port', app.get('port')));
