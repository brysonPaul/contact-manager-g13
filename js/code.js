const urlBase = 'http://COP4331-g13.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let index = 0;
let editTarget = 0;
let contactName = "";
let contactPhone = "";
let contactEmail = "";
let contactServer = "";
let searchCrit = "";
function doLogin() {
        userId = 0;
        firstName = "";
        index = 0;

        let login = document.getElementById("loginName").value;
        let password = document.getElementById("loginPassword").value;
        //      var hash = md5( password );

        document.getElementById("loginResult").innerHTML = "";

        let tmp = { login: login, password: password };
        //      var tmp = {login:login,password:hash};
        let jsonPayload = JSON.stringify(tmp);

        console.log(jsonPayload);

        let url = urlBase + '/Login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                                let jsonObject = JSON.parse(xhr.responseText);
                                userId = jsonObject.id;

                                if (userId < 1) {
                                        document.getElementById("loginResult").innerHTML = "<span style= 'background-color: white','color: black;'>" +"Username/Password combination incorrect.</span>";
                                        return;
                                }

                                firstName = jsonObject.firstName;

                                saveCookie();

                                window.location.href = "cop4331_home.html";
                        }
                };
                xhr.send(jsonPayload);
        }
        catch (err) {
                document.getElementById("loginResult").innerHTML = err.message;
        }

}
function validate(fName, lName, uN, pw) {

        let node = "";

        let fNameVal = /^[a-zA-Z-\s]{1,30}$/g;
        let lNameVal = /^[a-zA-Z-\s]{1,30}$/g;
        let userNVal = /^[a-zA-Z0-9]{1,15}$/g;
        let passWVal = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;

        console.log(fName);
        console.log(lName);
        console.log(uN);
        console.log(pw);

        if (!fNameVal.test(fName)) {
		document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "First names require alphabetical characters only.</span>"
                return false;
        }
        if (!lNameVal.test(lName)) {
                document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Last names require alphabetical characters only.</span>"
                return false;
        }
        if (!userNVal.test(uN)) {
                let uNError = document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Usernames require alphanumeric characters only.</span>"
                return false;
        }
        if (!passWVal.test(pw)) {
                let pwError = document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Passwords require a number and special character.</span>"
                return false;
        }
        return true;
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function doRegister() {
	let popError = document.getElementById("registerResult");

	let fName = document.getElementById("loginFirst").value;
        let lName = document.getElementById("loginLast").value;
        let uN = document.getElementById("registerName").value;
        let pw = document.getElementById("registerPassword").value;

        if (!validate(fName, lName, uN, pw)) {
                return;
        }

        let payload = {
                firstName: fName,
                lastName: lName,
                login: uN,
                password: pw
        };

        let jsonPayload = JSON.stringify(payload);

        let url = urlBase + '/Register.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
        xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                                let jsonObject = JSON.parse(xhr.responseText);
                                let error = jsonObject.error;
                                if (error != "N/A") {
                                        popError = document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Username already exists.</span>"
                                }
                                else {

                                //window.alert("You have registered successfully");

                                //      window.location.href = "cop4331_home.html";
					document.getElementById("registerResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Register Successful!</span>"
					document.getElementById("loginFirst").value="";
        				document.getElementById("loginLast").value="";
        				document.getElementById("registerName").value="";
        				document.getElementById("registerPassword").value="";
					console.log(fName.value);
                                }
                        }

                };
                xhr.send(jsonPayload);
        }
        catch (err) {
                document.getElementById("registerResult").innerHTML = err.message;
        }

}

//SubmitEvent.addEventListener('click', register);

function saveCookie() {
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        document.cookie = "firstName=" + firstName + ",index=" + index + ",userId=" + userId + ",contactId=" + editTarget +",contactName=" + contactName + ",contactPhone="+contactPhone+",contactEmail="+contactEmail+",contactServer="+contactServer+",searchCrit="+searchCrit+";expires=" + date.toGMTString();
}

function readCookie() {
        userId = -1;
        let data = document.cookie;
        let splits = data.split(",");
        for (var i = 0; i < splits.length; i++) {
                let thisOne = splits[i].trim();
                let tokens = thisOne.split("=");
                if (tokens[0] == "firstName") {
                        firstName = tokens[1];
                }
                else if (tokens[0] == "index") {
                       index = parseInt(tokens[1].trim());
                }
                else if (tokens[0] == "userId") {
                        userId = parseInt(tokens[1].trim());
                }
                else if (tokens[0] == "contactId"){
                        editTarget = parseInt(tokens[1].trim());
                }
                else if(tokens[0] == "contactName"){
                        contactName = tokens[1];
                }
                else if(tokens[0] == "contactPhone"){
                        contactPhone = tokens[1];
                }
                else if(tokens[0] == "contactEmail"){
                        contactEmail = tokens[1];
                }
                else if(tokens[0] == "contactServer"){
                        contactServer = tokens[1];
                }
		else if(tokens[0] == "searchCrit"){
			searchCrit = tokens[1];
		}
        }

        if( userId < 0 )
        {
                        window.location.href = "index.html";
        }
	/*
        else
        {
                        document.getElementById("userName").innerHTML = "Logged in as " + firstName;
        }*/
}

function doLogout() {
        userId = 0;
        firstName = "";
        index = 0;
        document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
}

function search(){
	readCookie();
	searchCrit = document.getElementById("search").value;
	index = 0;
	saveCookie();
	listContacts(0);
}

function addContact() {
        let fullname;
        let DOB;
        let emailAdd;
        let phoneNumber;

        fullname = document.getElementById("contactName").value;
        DOB = document.getElementById("contactDOB").value;
        emailAdd = document.getElementById("contactEmail").value;
        phoneNumber = document.getElementById("contactPhone").value;
	let photoInd = getRandomInt(12);

	if(!addValidation(fullname, DOB, phoneNumber, emailAdd)) {
		return;
	}

	let phoneSpace = /^\d{3}?[\s]+\d{3}?[\s]+\d{4}$/;
	let phoneNum = /^\d{10}?$/;

	if(phoneSpace.test(phoneNumber)){
		phoneNumber=phoneNumber.replaceAll(" ","-");
	}
	else if(phoneNum.test(phoneNumber)){
		phoneNumber=phoneNumber.slice(0,3)+"-"+phoneNumber.slice(3,6)+"-"+phoneNumber.slice(6,10);
	}

        readCookie();

        let payload = {
                userId: userId,
                name: fullname,
                server: DOB,
                email: emailAdd,
                phone: phoneNumber,
		photo: photoInd
        };

        console.log(payload);

        if (payload.id == "" || payload.name == "" || payload.server == "" || payload.email == "" || payload.phone == "") {
                
                return;
        }

        let newContact = JSON.stringify(payload);

        let url = urlBase + '/AddContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {

                //xhr.send(payload);
                console.log(payload);

                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                                let jsonObject = JSON.parse(xhr.responseText);
                                //window.alert("Contact created successfully!");
                                window.location.href = "cop4331_home.html";
                        }
                }

                xhr.send(newContact);
        }
        catch (err) {
                alert("Something went wrong. PLease check the information entered is correct and try again.")
        }
}

function editPage(id, name, phone, server, email) {
	readCookie();
        editTarget = id
        contactName=name;
        contactPhone=phone;
        contactServer=server;
        contactEmail=email;
        saveCookie();
        window.location.href = "cop4331_edit_contact.html";
}

function eScript(){
        readCookie();
        document.addEventListener("DOMContentLoaded", function (event) {
        document.getElementById("contactNamec").setAttribute("value",contactName);
        document.getElementById("contactDOBc").setAttribute("value",contactServer);
        document.getElementById("contactEmailc").setAttribute("value", contactEmail);
        document.getElementById("contactPhonec").setAttribute("value",contactPhone);
        });
	console.log(searchCrit);

}

function addPage() {
        window.location.href = "cop4331_add_contact.html";
}

function back() {
        window.location.href = "cop4331_home.html";
}

function editContact() {
        let fullname;
        let DOB;
        let email;
        let phoneNumber;
        readCookie();
        console.log("my id is "+editTarget);
        fullname = document.getElementById("contactNamec").value;
        DOB = document.getElementById("contactDOBc").value;
        email = document.getElementById("contactEmailc").value;
        phoneNumber = document.getElementById("contactPhonec").value;

	if(!editValidation(fullname, DOB, phoneNumber, email)) {
                return;
        }

	let phoneSpace = /^\d{3}?[\s]+\d{3}?[\s]+\d{4}$/;
	let phoneNum = /^\d{10}?$/;

	if(phoneSpace.test(phoneNumber)){
		phoneNumber=phoneNumber.replaceAll(" ","-");
	}
	else if(phoneNum.test(phoneNumber)){
		phoneNumber=phoneNumber.slice(0,3)+"-"+phoneNumber.slice(3,6)+"-"+phoneNumber.slice(6,10);
	}

        let payload = {
                id: editTarget,
                name: fullname,
                server: DOB,
                email: email,
                phone: phoneNumber
        };

        console.log(payload);

        if (payload.id == "" || payload.contactId == "" || payload.fn == "" || payload.server == "" || payload.email == "" || payload.phone == "") {
                //window.alert("Please fill out all required fields!");
		document.getElementById("editResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Please fill out all required fields.</span>"
                return;
        }

        let url = urlBase + '/EditContact.' + extension;

        let editedContact = JSON.stringify(payload);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {

                //xhr.send(payload);
                console.log(payload);

                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                              //  saveCookie();
                                window.location.href = "cop4331_home.html";
                                //window.alert("Contact edited successfully!");
                        }
                }
                console.log(editedContact);
                xhr.send(editedContact);
        }
        catch (err) {
                alert("Something went wrong. PLease check the information entered is correct and try again.")
        }
}
function listContactsOnLoad(){
        //why do we need this you might ask? well the event listener needs to be there on load, but on list it has no need because all the elements are there
        //without this we have an infinite listener when hitting back and next
        document.addEventListener("DOMContentLoaded", function (event) {
                listContacts(0);
        });
}

function listContacts(addBy) {
        //next button makes addBy = 1
        //reprinting the page makes addBy = 0
        //back button makes addBy = -1
        //using the search button sets index = 0, search = {search crit}

        //on opening the user page we are going to run the script with addBy = 0

        //if index-1 < 0, we hide the back button
        readCookie();
        index += addBy;
        //we fetch the list of users based on search criterion (if applicable), current index+addBy, and the userId and sending it all to the php script
        //on return we will have a list of json objects

        if(index == 0){
                document.getElementById("backButton").style.display="none";
        }
        else{
                document.getElementById("backButton").style.display="inline";
        }

        let  payload = {
                        userId: userId,
                        search: searchCrit,
                        index: index
                };
        console.log("payload: " + payload);
        console.log("index"+index);
        let r = JSON.stringify(payload);

        let url = urlBase + '/ListContacts.' + extension;
        let xhr = new XMLHttpRequest();


        //then run a for loop that runs through our current 5 showing users placing the information that we have received from the php query
        //ensure that the edit and delete query are aware of a contact's id
        //if there is less than 5 results from php, we hide the user cards that we do not need to se

                let contacts = "tt";
                xhr.open("POST", url, true);
                xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

                try {

                        xhr.send(r);
                        xhr.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                        contacts = JSON.parse(xhr.responseText);
                                        //save cookie of new index
                                        saveCookie();
					document.getElementById("search").value = searchCrit;
                                        console.log("contacts:" + contacts);
					let err = "";

                                        let inc = 0;
                                        for (inc; inc<contacts.length;inc++) (function(inc){
                                                document.getElementById("contactCol" + (inc + 1)).style.display = "inline";
                                                document.getElementById("contactName" + (inc + 1)).innerHTML = contacts[inc].name;
                                                document.getElementById("contactDOB" + (inc + 1)).innerHTML = contacts[inc].server;//fix to server when august does so
                                                document.getElementById("contactPhone" + (inc + 1)).innerHTML = contacts[inc].phone;
                                                document.getElementById("contactEmail" + (inc + 1)).innerHTML = contacts[inc].email;
						err = contacts[inc].error;
						document.getElementById("contactImage" + (inc + 1)).src = "../images/profile"+(contacts[inc].photo+1)+".png";
                                                document.getElementById("editButton"+(inc+1)).onclick = function(){ editPage(contacts[inc].id, contacts[inc].name, contacts[inc].phone,contacts[inc].server, contacts[inc].email)};
                                                document.getElementById("deleteButton"+(inc+1)).onclick = function(){deleteContact(contacts[inc].id)};
                                        })(inc);
                                        //if its less than 5 we hide the rest

                                        if(inc<5 || err == "OOB-SOON"){
                                                document.getElementById("nextButton").style.display="none";
                                        }
                                        else{
                                                document.getElementById("nextButton").style.display="inline";
                                        }

                                        for (inc; inc < 5; inc++) {
                                                document.getElementById("contactCol" + (inc + 1)).style.display = "none";
                                        }
                                }
                        };
                }
                catch (err) {
                        //alert("Something went wrong. PLease check the information entered is correct and try again.")
                }
        //if when we fetch a list and it is less than 5, we hide the next button
        //(aware of the edge case when a user has 5 people, will probably send an error if this is the case so I am aware in the js)



}
function deleteContact(contactId) {
        if(!window.confirm("Are you sure you want to delete this contact.")) {
                return;
        }
        let payload = {
                id: contactId
        }
        let deletedContact = JSON.stringify(payload);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset = UTF-8");

        try {
                xhr.onreadystatechange = function() {
                        if(this.readyState == 4 && this.status == 200) {
                                listContacts(0);
                        }
                }
                xhr.send(deletedContact);

        }
        catch(error) {
                alert("Something went wrong. PLease check the information entered is correct and try again.");
        }
     //   listContacts(0);
      //  window.location.href = "cop4331_home.html";
}
function addValidation(name, server, phone, email) {

	let fNameVal = /^[a-zA-Z\s]{1,30}$|^[a-zA-Z0-9]{1,15}$/;
	let serverVal = /^\d{1,3}?[.]+\d{1,3}?[.]+\d{1,3}?[.]+\d{1,3}$|^[a-zA-Z\s]+$|^[a-z]+\.[a-zA-Z]+\.(com|net|xyz|edu)$/;
	let emailVal = /^[a-zA-z0-9]+?@[a-zA-Z]+?\.[a-z]{3}$/;
	let phoneDash = /^\d{3}?[\-]+\d{3}?[\-]+\d{4}$/;
	let phoneSpace = /^\d{3}?[\s]+\d{3}?[\s]+\d{4}$/;
	let phoneNum = /^\d{10}?$/;
	if(!fNameVal.test(name)) {
		document.getElementById("addResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "The name field must be a name or gamertag</span>"
		//alert("The name field must be a name or gamertag");
		return false;
	}
	if(!serverVal.test(server)) {
		document.getElementById("addResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "The server field must be a server name, server domain, or ipv4.</span>";
		//alert("The server field must be a server name, server domain, or ipv4.");
		return false;
	}
	if(!emailVal.test(email)) {
		//alert("Please verify the email address is inputted correctly.");
		document.getElementById("addResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Please verify the email address is correct.</span>";
		return false;
	}
	if(!phoneDash.test(phone) && !phoneSpace.test(phone) && !phoneNum.test(phone)) {
		//alert("Please verify the phone number is inputed correctly.");
		document.getElementById("addResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Please verify the phone number is inputted correctly.</span>";
		return false;
	}
	return true;

}
function editValidation(name, server, phone, email) {

        let fNameVal = /^[a-zA-Z\s]{1,30}$|^[a-zA-Z0-9]{1,15}$/;
        let serverVal = /^\d{1,3}?[.]+\d{1,3}?[.]+\d{1,3}?[.]+\d{1,3}$|^[a-zA-Z\s]+$|^[a-z]+\.[a-zA-Z]+\.(com|net|xyz|edu)$/g;
        let emailVal = /^[a-zA-z0-9]+?@[a-zA-Z]+?\.[com|net|edu|xyz]{3}$/;
        let phoneVal = /^\d{3}?[\s\-]+\d{3}?[\s\-]+\d{4}$/;
	let phoneNum = /^\d{10}?$/;

        if(!fNameVal.test(name)) {
		document.getElementById("editResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "The name field must be a name or gamertag</span>";
                //alert("The name field must be a name or gamertag.");
                return false;
        }
        if(!serverVal.test(server)) {
                document.getElementById("editResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "The server field must be a server, server domain, or ipv4.</span>";
		//alert("The server field must be a server, server domain, or ipv4.");
                return false;
        }
        if(!emailVal.test(email)) {
		document.getElementById("editResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Please verify the email address is inputted correctly.</span>";
                //alert("Please verify the email address is inputted correctly.");
                return false;
        }
        if(!phoneVal.test(phone) && !phoneNum.test(phone)) {
		document.getElementById("editResult").innerHTML = "<span style= 'background-color: white','color: black;'>" + "Please verify the phone number is inputed correctly.</span>";
                //alert("Please verify the phone number is inputed correctly.");
                return false;
        }
        return true;

}
