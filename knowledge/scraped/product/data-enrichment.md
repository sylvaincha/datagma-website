# Data Enrichment (general)

**Source URL**: https://datagma.com/data-enrichment/
**SEO Title**: Boost Your Outreach with B2B Data Enrichment Services
**Meta Description**: Unlock the power of your data with Datagma's B2B data enrichment services. Enhance accuracy and insights with our trusted solutions in your journey to success!

---

## Hero / H1
B2B Data Enrichment Services

## Page structure (headings)
- [h2] Instantly understand your customers
- [h2] How to use Datagma Enrichment?
- [h2] What you can do with Data Enrichment?
  - [h3] GIVE IT A TRY
  - [h3] Sign up to reveal your data
  - [h3] No credit card required, under the call to action
  - [h3] Can be used with File Upload:
  - [h3] Can be Used with API:
  - [h3] Lead Scoring
  - [h3] Email Personalization
  - [h3] Keep your CRM Updated

## Full content

Solutions

	Data Enrichment
	Email Finder
	Phone finder
	Job Change Detection

Features

	API
	Chrome Extension
	File Upload
	Integrations
	HubSpot Enrichment

Playbook
Pricing
Blog

	

	

		
			
				
		
	
	
		Solutions

	Data Enrichment
	Email Finder
	Phone finder
	Job Change Detection

Features

	API
	Chrome Extension
	File Upload
	Integrations
	HubSpot Enrichment

Playbook
Pricing
Blog
	
	
		
			Log In
			Get Started
		
	
	
		
			
			
		
	
	
 
	
	
	
		
	
		 
				
				
			 	

						
	
		Data Enrichment
	 
					
 
	 
	
	 B2B Data Enrichment Services

	Get the Full Detail Online
	Datagma enrich any LinkedIn URL, email, or Full Name & Company, with more than 75 data points about the person and his company.

	
	
			
			Try for Free
	
	

No credit card required. Start in 30 seconds
	

function checkValidateEmail() {
 var emailInput = document.getElementById("email_input");
 var errorMessage = document.getElementById("error-message");
 var email = emailInput.value.trim();
 var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

 if (email === "") {
 errorMessage.textContent = "Please enter an email address.";
 document.querySelector(".btn-free").disabled = true;
 } else if (reg.test(email)) {
 errorMessage.textContent = "";
 document.querySelector(".btn-free").disabled = false;
 } else {
 errorMessage.textContent = "Please enter a valid email address.";
 document.querySelector(".btn-free").disabled = true;
 }
 }

 function mail_send() {
 var emailInput = document.getElementById("email_input");
 var input = emailInput.value.trim();
 var errorMessage = document.getElementById("error-message");

 if (input === "") {
 errorMessage.textContent = "Please enter an email address.";
 emailInput.focus();
 } else if (emailInput.checkValidity()) {
 // The email is valid, you can proceed with your code here.
 window.open("https://app.datagma.com/sign-up?email=" + input);
 } else {
 errorMessage.textContent = "Please enter a valid email address.";
 emailInput.focus();
 }
 }

 // Attach the checkValidateEmail function to the input's input event.
 document.getElementById("email_input").addEventListener("input", checkValidateEmail);

	.error-message-new.error-msg-unset {
		max-width: unset;
 font-size: 12px;
 margin-top: -10px;
	}
	.topbar {
 width: 100%;
 margin: 0 auto;
 display: flex;
 align-items: center;
}
.topbar input[type=text] {
 padding: 19px;
 background: #FFFFFF;
 	border: 1px solid rgba(0, 49, 114, 0.653218)!important;
 float: left;
 max-width: 303px;
 font-weight: normal;
 font-size: 12px;
 line-height: 15px;
 color: #9BB4CD;
 width: 100%;
	 margin-bottom: 0;
	 border-top-left-radius: 60px;
 border-bottom-left-radius: 60px;
}

.topbar button {
		float: left;
 max-width: 115px;
 padding: 11.5px;
 color: rgb(255 255 255);
 cursor: pointer;
 background: rgb(0 49 114) !important;
 border: 1px solid rgb(0 49 114) !important;
 border-radius: 0px 0px 15px 0px;
 font-weight: 700;
 font-size: 15px;
 width: 100%;
}
	.topbar button:hover{
		background: rgb(0 49 114);
 border: 1px solid rgb(0 49 114);
	}
Instantly understand your customers			From the first form-fill, you’ll have contact any company details for modern
lead scoring, routing, ideal customer profile analysis, and segmentation

					GIVE IT A TRY

		

			
			
						
							

			
				
				
							
								

	

Try for Free

	
		
			Sign up to reveal your data
		
		
			Please sign up to reveal this search result.
You will receive a free trial with 1000 credits.
		
		
			
		
	
	
			
			
				 First name:
 
			
				
					 Last name:
 	
					
		
		
					
			
				 Email
 
				 
				
		
		
					
			
				 Company Name
 
				 
				
		
		
			
		 	
 			 Password
 
					 
				At least 8 characters long.
			
		
		
					
					
						Reveal result
							
					
						By submitting this form you agree to Terms and Conditions
					
			
			
	

function check_validate_email() {
 var email = document.getElementById("free_email_11").value;
 var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 if (reg.test(email)) {
 document.getElementById("email-submit-free-main").disabled = false;
 } else {
 document.getElementById("email-submit-free-main").disabled = true;
 }
 }

 function showLoader() {
 document.getElementById("loader").style.display = "block";
 $("#email-submit-free-main").attr('disabled', 'disabled');
 $("body").css("overflow", "hidden");
 }

 function disableLoader() {
 $("#email-submit-free-main").removeAttr('disabled');
 document.getElementById("loader").style.display = "none";
 $("body").css("overflow", "auto");
 }

 function openForm() {
 document.getElementById("mySignupForm").style.display = "block";
 $("body").css("overflow", "hidden");
 }

 function closeForm() {
 $("body").css("overflow", "auto");
 document.getElementById("mySignupForm").style.display = "none";
 }

 function validateEmail(email) {
 var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 return reg.test(email);
 }

 function sendMail() {
 var input = document.getElementById("free_email_11").value;
 var errorMessage = document.getElementById("error-message-span");

 if (input.trim() === "") {
 errorMessage.textContent = "Please enter your email address.";
					console.log("enter email address");
 } else if (!validateEmail(input)) {
 errorMessage.textContent = "Please enter a valid email address.";
						console.log("enter valid email address");
 } else {
 
 showLoader();
 var myVar = setTimeout(function () {
 disableLoader();
 openForm();
 }, 3000);
 errorMessage.textContent = ""; // Clear any previous error message
 }
 }
$("#email-submit-free-main").click(function() {

 var input = $("#free_email_11").val();
 var errorMessage = $("#error-message");

 if (input && input.trim() !== "") {
 if (validateEmail(input)) {
 // Clear any previous error message
 errorMessage.text("");
 showLoader();
 var myVar = setTimeout(function() {
 disableLoader();
 openForm();
 }, 3000);
 } else {
 errorMessage.text("Please enter a valid email address.");
 
 }
 } else {
 errorMessage.text("Please enter your email address.");
 
 }
 });

	.topbar {
 width: 100%;
 margin: 0 auto;
 display: flex;
 align-items: center;
 justify-content: center;
		position: relative;
}
.topbar input[type=text] {
 padding: 19px;
 background: #FFFFFF;
 	border: 1px solid rgba(0, 49, 114, 0.653218)!important;
 float: left;
 max-width: 353px;
 font-weight: normal;
 font-size: 12px;
 line-height: 15px;
 color: #9BB4CD;
 width: 100%;
	 margin-bottom: 0;
	 border-top-left-radius: 60px;
 border-bottom-left-radius: 60px;
}
.topbar button {
 float: left;
 max-width: 115px;
 padding: 11.5px;
 color: white;
 cursor: pointer;
 background: #2589FF;
 border: 1px solid #2589FF;
 border-radius: 0px 0px 15px 0px;
 font-weight: 600;
 font-weight: 500;
 font-size: 15px;
 width: 100%;
}
#loader {
 position: absolute;
 left: 50%;
/* top: 50%; */
 z-index: 1;
 width: 120px;
 height: 120px;
 margin: -76px 0 0 -76px;
 border: 16px solid #F3F3F3;
 border-radius: 50%;
 border-top: 16px solid #3498DB;
 -webkit-animation: spin 2s linear infinite;
 animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
 0% { -webkit-transform: rotate(0deg); }
 100% { -webkit-transform: rotate(360deg); }
}
@keyframes spin {
 0% { transform: rotate(0deg); }
 100% { transform: rotate(360deg); }
}
	
	
/* .main-modal {
 position: absolute;
 top: 41px;
 left: 0;
 right: 0;
 width: 750px;
 margin: 2px auto;
 border-radius: 8px;
	 background: #fff;
	 box-shadow: 0px 3.38839px 6.77679px -3.38839px rgb(24 39 75 / 12%), 0px 4.51786px 13.5536px -2.25893px rgb(24 39 75 / 8%);
	z-index: 8;
} */
	.modal {
 display: none;
 position: fixed;
 z-index: 3;
 padding-top: 132px;
 left: 0;
 top: 0;
 width: 100%;
 height: 100%;
 overflow: auto;
 background-color: rgb(0,0,0);
 background-color: rgb(0 0 0 / 40%);
}
	.modal-content {
 background-color: rgb(254 254 254);
 margin: auto;
 padding: 0px;
 border: 1px solid rgb(136 136 136);
 width: 750px;
		border-radius: 20px;
}
	.row-modal3 {
	padding-top: 10px;
	}
	
.main-modal-hadding {
 text-align: center;
	background: #F4FFFE;
	 padding: 31px 0px;
	border-bottom: 1px solid #DDDDDD;
	border-radius: 20px 20px 0px 0px;
	 position: relative;
}
	.close-marke {
 position: absolute;
 top: 8px;
 right: 19px;
}
	.close-marke img {
 width: 23px;
}
.modal-box2 {
 padding-left: 30px;
}
.row-modal {
 display: flex;
	padding-top: 25px;
}
.main-modal-start {
 padding: 0px 30px;
}
	.main-modal-hadding h3{
	font-family: Montserrat;
font-style: normal;
font-weight: 600;
font-size: 28px;
line-height: 34px;
color: #003172;
	}
	
		.main-modal-hadding p{
font-family: Montserrat;
font-style: normal;
font-weight: normal;
font-size: 23px;
line-height: 150%;
color: #7A869A;
			margin-bottom: 0px;
	}
.modal-box input {
 width: 324px;
	 height: 40px;
 background: #FCFCFC;
 border: 1px solid #DDDDDD !important;
 box-sizing: border-box;
 border-radius: 10px;
 box-shadow: none !important;
}
.modal-box2 input {
 width: 333px;
	 height: 40px;
 background: #FCFCFC;
 border: 1px solid #DDDDDD !important;
 box-sizing: border-box;
 border-radius: 10px;
 box-shadow: none !important;
}
.modal-box2 label {
 font-family: Montserrat;
 font-style: normal;
 font-weight: 600;
 font-size: 19px;
 line-height: 23px;
 color: #222222;
	 margin-bottom: 19px;
}
.modal-box label {
 font-family: Montserrat;
 font-style: normal;
 font-weight: 600;
 font-size: 19px;
 line-height: 23px;
 color: #222222;
	 margin-bottom: 19px;
}
.row-modal3 .modal-box input {
 width: 687px;
 background: #FCFCFC;
 border: 1px solid #DDDDDD !important;
 box-sizing: border-box;
 border-radius: 10px;
 box-shadow: none !important;
}
	
	.row-modal3 .modal-box span{
		font-family: Montserrat;
 font-style: normal;
 font-weight: normal;
 font-size: 19px;
 line-height: 150%;
 color: #7A869A;
	}
	
	.modal-button {
		text-align: center;
 margin-top: 20px;
}
	
	
	.modal-button button {
 width: 175px;
 height: 72px;
 left: 288px;
 top: 954px;
 background: #2589FF;
 box-shadow: 0px 25px 60px rgb(0 0 0 / 8%);
 border-radius: 8px;
 color: #FFFFFF;
 font-weight: 500;
 font-size: 19px;
 font-family: Montserrat;
}
	.modal-button p{
		font-family: Montserrat;
font-style: normal;
font-weight: normal;
font-size: 19px;
line-height: 150%;
color: #7A869A;
		 margin-top: 19px;
 margin-bottom: 42px;
	}
	.error-message-new {
		max-width: 460px;
	}
			No credit card required, under the call to action

		
	

	
		
	
	
	
	
		Person
		Email
		LinkedIn Url
 Full name & Company
		
			
	
	
	
	
	
	
		
	

	
		
		Company
		Company name
		Websitel
 Siren Number
		
	

	
	
How to use Datagma Enrichment?

	
		 Can be used with integrations:
	
	

	
	
		
				
		
			
				
		
			
				
		
			
				
		
			
				
		
			
				
		
	

	
[slide-anything id="5923"]Learn more about our integration

	Can be used with File Upload:

Upload your incomplete CSV or Excel file
Choose your enrichment options
Received your enhanced file delivered in minutes

	Can be Used with API:

Get your Key immediately with hundreds of credits. No wait time.
Play with the API directly in the browser. No need to be a tech.
Comprehensive doc and impressive roadmap

What you can do with Data Enrichment?			
		

	Lead Scoring
Enrich your prospect’s data to identify the best lead based on your criteria and help your sales teams prioritize

	Email Personalization
Use unique tags, so your prospects can’t think your campaigns are automated

	Keep your CRM Updated
Stop wasting time on data entry that nobody does. Instead, automatically enrich your CRM with the most complete and recent data

			Get started with
160 free matches.

		
	
		Start for free
	
	 
						
	
		 	 
						 
	

	
	
	
	
					
 			 
			 							
			 					
			 

		 

	
		 
		 

	 

	
		
			
				
									
				 
			
			
				
					Quick LinksSign Up
API Docs
Integrations
Playbooks
Changelog
				
				
					CompanyOpt Out (Remove your data)
Terms
Digital Processing Agreement
Legal Notice
Privacy Policy
				
				
					Good ReadsClearbit Alternative
How to search for Mobile Phone Numbers of LinkedIn Users
Hubspot Enrichment to boost your conversion rate
How to use the Datagma Chrome Extension
The phone numbers API guide
				
			
		
	
	
		©
		2026			 Datagma Copyright. All rights reserved.
	

{"prefetch":[{"source":"document","where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":["/wp-*.php","/wp-admin/*","/wp-content/uploads/*","/wp-content/*","/wp-content/plugins/*","/wp-content/themes/JointsWP-CSS-master/*","/*\\?(.+)"]}},{"not":{"selector_matches":"a[rel~=\"nofollow\"]"}},{"not":{"selector_matches":".no-prefetch, .no-prefetch a"}}]},"eagerness":"conservative"}]}

			
				(function(){let request = new XMLHttpRequest();
					let url = 'ht' + 'tps:' + '//' + 'api.weglot.com/' + 'pageviews?api_key=' + 'wg_d189cf2587245f402b5cd61ac60c60369';
					let data = JSON.stringify({
							url: location.protocol + '//' + location.host + location.pathname,
							language: document.getElementsByTagName('html')[0].getAttribute('lang'),
							browser_language: (navigator.language || navigator.userLanguage)
						}
					);
					request.open('POST', url, true);
					request.send(data);
				})();
			
		/* Layout w660276527c608 */ #pgc-w660276527c608-0-0 { width:57.2838%;width:calc(57.2838% - ( 0.42716162287995 * 30px ) ) } #pgc-w660276527c608-0-1 { width:42.7162%;width:calc(42.7162% - ( 0.57283837712005 * 30px ) ) } #pl-w660276527c608 .so-panel { margin-bottom:30px } #pl-w660276527c608 .so-panel:last-of-type { margin-bottom:0px } #pg-w660276527c608-0.panel-has-style > .panel-row-style, #pg-w660276527c608-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w660276527c608-0.panel-no-style, #pg-w660276527c608-0.panel-has-style > .panel-row-style, #pg-w660276527c608-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w660276527c608-0 > .panel-grid-cell , #pg-w660276527c608-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w660276527c608-0-0 { margin-bottom:30px } #pl-w660276527c608 .panel-grid-cell { padding:0 } #pg-w660276527c608-0 .panel-grid-cell-empty { display:none } #pl-w660276527c608 .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } /* Layout w65019a629e744 */ #pgc-w65019a629e744-0-0 { width:50.6452%;width:calc(50.6452% - ( 0.49354838709677 * 30px ) ) } #pgc-w65019a629e744-0-1 { width:49.3548%;width:calc(49.3548% - ( 0.50645161290323 * 30px ) ) } #pl-w65019a629e744 .so-panel { margin-bottom:30px } #pl-w65019a629e744 .so-panel:last-of-type { margin-bottom:0px } #pg-w65019a629e744-0.panel-has-style > .panel-row-style, #pg-w65019a629e744-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w65019a629e744-0.panel-no-style, #pg-w65019a629e744-0.panel-has-style > .panel-row-style, #pg-w65019a629e744-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w65019a629e744-0 > .panel-grid-cell , #pg-w65019a629e744-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w65019a629e744-0-0 { margin-bottom:30px } #pl-w65019a629e744 .panel-grid-cell { padding:0 } #pg-w65019a629e744-0 .panel-grid-cell-empty { display:none } #pl-w65019a629e744 .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } /* Layout w650d9be6c8fb0 */ #pgc-w650d9be6c8fb0-0-0 { width:52%;width:calc(52% - ( 0.48 * 30px ) ) } #pgc-w650d9be6c8fb0-0-1 { width:48%;width:calc(48% - ( 0.52 * 30px ) ) } #pl-w650d9be6c8fb0 .so-panel { margin-bottom:30px } #pl-w650d9be6c8fb0 .so-panel:last-of-type { margin-bottom:0px } #pg-w650d9be6c8fb0-0.panel-has-style > .panel-row-style, #pg-w650d9be6c8fb0-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w650d9be6c8fb0-0.panel-no-style, #pg-w650d9be6c8fb0-0.panel-has-style > .panel-row-style, #pg-w650d9be6c8fb0-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w650d9be6c8fb0-0 > .panel-grid-cell , #pg-w650d9be6c8fb0-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w650d9be6c8fb0-0-0 { margin-bottom:30px } #pl-w650d9be6c8fb0 .panel-grid-cell { padding:0 } #pg-w650d9be6c8fb0-0 .panel-grid-cell-empty { display:none } #pl-w650d9be6c8fb0 .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } /* Layout w65118f385dfdb */ #pgc-w65118f385dfdb-0-0 , #pgc-w65118f385dfdb-0-1 { width:50%;width:calc(50% - ( 0.5 * 30px ) ) } #pl-w65118f385dfdb .so-panel { margin-bottom:30px } #pl-w65118f385dfdb .so-panel:last-of-type { margin-bottom:0px } #pg-w65118f385dfdb-0.panel-has-style > .panel-row-style, #pg-w65118f385dfdb-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w65118f385dfdb-0.panel-no-style, #pg-w65118f385dfdb-0.panel-has-style > .panel-row-style, #pg-w65118f385dfdb-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w65118f385dfdb-0 > .panel-grid-cell , #pg-w65118f385dfdb-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w65118f385dfdb-0-0 { margin-bottom:30px } #pl-w65118f385dfdb .panel-grid-cell { padding:0 } #pg-w65118f385dfdb-0 .panel-grid-cell-empty { display:none } #pl-w65118f385dfdb .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } /* Layout w65117b601ad07 */ #pgc-w65117b601ad07-0-0 , #pgc-w65117b601ad07-0-1 { width:50%;width:calc(50% - ( 0.5 * 30px ) ) } #pl-w65117b601ad07 .so-panel { margin-bottom:30px } #pl-w65117b601ad07 .so-panel:last-of-type { margin-bottom:0px } #pg-w65117b601ad07-0.panel-has-style > .panel-row-style, #pg-w65117b601ad07-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w65117b601ad07-0.panel-no-style, #pg-w65117b601ad07-0.panel-has-style > .panel-row-style, #pg-w65117b601ad07-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w65117b601ad07-0 > .panel-grid-cell , #pg-w65117b601ad07-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w65117b601ad07-0-0 { margin-bottom:30px } #pl-w65117b601ad07 .panel-grid-cell { padding:0 } #pg-w65117b601ad07-0 .panel-grid-cell-empty { display:none } #pl-w65117b601ad07 .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } /* Layout w65117f36ab1fd */ #pgc-w65117f36ab1fd-0-0 , #pgc-w65117f36ab1fd-0-1 { width:50%;width:calc(50% - ( 0.5 * 30px ) ) } #pl-w65117f36ab1fd .so-panel { margin-bottom:30px } #pl-w65117f36ab1fd .so-panel:last-of-type { margin-bottom:0px } #pg-w65117f36ab1fd-0.panel-has-style > .panel-row-style, #pg-w65117f36ab1fd-0.panel-no-style { -webkit-align-items:flex-start;align-items:flex-start } @media (max-width:780px){ #pg-w65117f36ab1fd-0.panel-no-style, #pg-w65117f36ab1fd-0.panel-has-style > .panel-row-style, #pg-w65117f36ab1fd-0 { -webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column } #pg-w65117f36ab1fd-0 > .panel-grid-cell , #pg-w65117f36ab1fd-0 > .panel-row-style > .panel-grid-cell { width:100%;margin-right:0 } #pgc-w65117f36ab1fd-0-0 { margin-bottom:30px } #pl-w65117f36ab1fd .panel-grid-cell { padding:0 } #pg-w65117f36ab1fd-0 .panel-grid-cell-empty { display:none } #pl-w65117f36ab1fd .panel-grid .panel-grid-cell-mobile-last { margin-bottom:0px } } 

{"baseUrl":"https://s.w.org/images/core/emoji/17.0.2/72x72/","ext":".png","svgUrl":"https://s.w.org/images/core/emoji/17.0.2/svg/","svgExt":".svg","source":{"concatemoji":"https://datagma.com/wp-includes/js/wp-emoji-release.min.js?ver=6.9.4"}}

/* <![CDATA[ */
/*! This file is auto-generated */
const a=JSON.parse(document.getElementById("wp-emoji-settings").textContent),o=(window._wpemojiSettings=a,"wpEmojiSettingsSupports"),s=["flag","emoji"];function i(e){try{var t={supportTests:e,timestamp:(new Date).valueOf()};sessionStorage.setItem(o,JSON.stringify(t))}catch(e){}}function c(e,t,n){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);t=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(n,0,0);const a=new Uint32Array(e.getImageData(0,0,e.canvas.width,e.canvas.height).data);return t.every((e,t)=>e===a[t])}function p(e,t){e.clearRect(0,0,e.canvas.width,e.canvas.height),e.fillText(t,0,0);var n=e.getImageData(16,16,1,1);for(let e=0;e<n.data.length;e++)if(0!==n.data[e])return!1;return!0}function u(e,t,n,a){switch(t){case"flag":return n(e,"\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f","\ud83c\udff3\ufe0f\u200b\u26a7\ufe0f")?!1:!n(e,"\ud83c\udde8\ud83c\uddf6","\ud83c\udde8\u200b\ud83c\uddf6")&&!n(e,"\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f","\ud83c\udff4\u200b\udb40\udc67\u200b\udb40\udc62\u200b\udb40\udc65\u200b\udb40\udc6e\u200b\udb40\udc67\u200b\udb40\udc7f");case"emoji":return!a(e,"\ud83e\u1fac8")}return!1}function f(e,t,n,a){let r;const o=(r="undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?new OffscreenCanvas(300,150):document.createElement("canvas")).getContext("2d",{willReadFrequently:!0}),s=(o.textBaseline="top",o.font="600 32px Arial",{});return e.forEach(e=>{s[e]=t(o,e,n,a)}),s}function r(e){var t=document.createElement("script");t.src=e,t.defer=!0,document.head.appendChild(t)}a.supports={everything:!0,everythingExceptFlag:!0},new Promise(t=>{let n=function(){try{var e=JSON.parse(sessionStorage.getItem(o));if("object"==typeof e&&"number"==typeof e.timestamp&&(new Date).valueOf()<e.timestamp+604800&&"object"==typeof e.supportTests)return e.supportTests}catch(e){}return null}();if(!n){if("undefined"!=typeof Worker&&"undefined"!=typeof OffscreenCanvas&&"undefined"!=typeof URL&&URL.createObjectURL&&"undefined"!=typeof Blob)try{var e="postMessage("+f.toString()+"("+[JSON.stringify(s),u.toString(),c.toString(),p.toString()].join(",")+"));",a=new Blob([e],{type:"text/javascript"});const r=new Worker(URL.createObjectURL(a),{name:"wpTestEmojiSupports"});return void(r.onmessage=e=>{i(n=e.data),r.terminate(),t(n)})}catch(e){}i(n=f(s,u,c,p))}t(n)}).then(e=>{for(const n in e)a.supports[n]=e[n],a.supports.everything=a.supports.everything&&a.supports[n],"flag"!==n&&(a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&a.supports[n]);var t;a.supports.everythingExceptFlag=a.supports.everythingExceptFlag&&!a.supports.flag,a.supports.everything||((t=a.source||{}).concatemoji?r(t.concatemoji):t.wpemoji&&t.twemoji&&(r(t.twemoji),r(t.wpemoji)))});
//# sourceURL=https://datagma.com/wp-includes/js/wp-emoji-loader.min.js
/* ]]> */

document.body.className = document.body.className.replace("siteorigin-panels-before-js","");

(function (d, u, h, s) {
 h = d.getElementsByTagName('head')[0];
 s = d.createElement('script');
 s.async = 1;
 s.src = u + new Date().getTime();
 h.appendChild(s);
 })(document, 'https://grow.clearbitjs.com/api/pixel.js?v=');

	function getUrlVars() {
		var vars = [],
			hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

		jQuery(document).ready(function($) {
			var params = getUrlVars();
			if (params["fpr"]) {
				$('.getstarted-btn').attr('href', 'https://app.datagma.com/sign-in?fpr=' + params["fpr"]);
				$('.signup-btn').attr('href', 'https://app.datagma.com/sign-up?fpr=' + params["fpr"]);
			}
	});
	$(window).bind('scroll', function() {
		if ($(window).scrollTop() > 50) {
			$('.custom-header').addClass('sticky-header');
		} else {
			$('.custom-header').removeClass('sticky-header');
		}
	});
		
	// New script
	window.axeptioSettings = {
		clientId: "619382b26cb8cc31df32c528",
		cookiesVersion: "datagma-base",
	};

	(function(d, s) {
		var t = d.getElementsByTagName(s)[0],
			e = d.createElement(s);
		e.async = true;
		e.src = "//static.axept.io/sdk.js";
		t.parentNode.insertBefore(e, t);
	})(document, "script");

	! function() {
		var a = window.VL = window.VL || {};
		return a.instances = a.instances || {}, a.invoked ? void(window.console && console.error && console.error("VL snippet loaded twice.")) : (a.invoked = !0, void(a.load = function(b, c, d) {
			var e = {};
			e.publicToken = b, e.config = c || {};
			var f = document.createElement("script");
			f.type = "text/javascript", f.id = "vrlps-js", f.defer = !0, f.src = "https://app.viral-loops.com/client/vl/vl.min.js";
			var g = document.getElementsByTagName("script")[0];
			return g.parentNode.insertBefore(f, g), f.onload = function() {
				a.setup(e), a.instances[b] = e
			}, e.identify = e.identify || function(a, b) {
				e.afterLoad = {
					identify: {
						userData: a,
						cb: b
					}
				}
			}, e.pendingEvents = [], e.track = e.track || function(a, b) {
				e.pendingEvents.push({
					event: a,
					cb: b
				})
			}, e.pendingHooks = [], e.addHook = e.addHook || function(a, b) {
				e.pendingHooks.push({
					name: a,
					cb: b
				})
			}, e.$ = e.$ || function(a) {
				e.pendingHooks.push({
					name: "ready",mail
					cb: a
				})
			}, e
		}))
	}();
	var campaign = VL.load("kgxdyj1Dj50aIpP4JhneyVmvQCA", {
		autoLoadWidgets: !0
	});

const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
 accordionItemHeader.addEventListener("click", event => {
 
 // Uncomment in case you only want to allow for the display of only one collapsed item at a time!
 
// const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
// if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
// currentlyActiveAccordionItemHeader.classList.toggle("active");
// currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
// }

 accordionItemHeader.classList.toggle("active");
 const accordionItemBody = accordionItemHeader.nextElementSibling;
 if(accordionItemHeader.classList.contains("active")) {
 accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
 }
 else {
 accordionItemBody.style.maxHeight = 0;
 }
 
 });
});

EnglishItalianoEspañolFrançaisPortuguês Brasileiro 

 ×
