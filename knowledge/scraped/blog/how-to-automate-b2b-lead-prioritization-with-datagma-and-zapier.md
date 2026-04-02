# Automate Lead Prioritization with Zapier

**Source URL**: https://datagma.com/how-to-automate-b2b-lead-prioritization-with-datagma-and-zapier/
**SEO Title**: Simplify B2B Lead Scoring: Datagma and Zapier for B2B Sales Success
**Meta Description**: Automate B2B lead prioritization effortlessly using Datagma and Zapier. Learn the simple steps to enhance your sales strategy today. Join us now!

---

## Page structure (headings)
- [h2] How you can prioritize lead by leveraging Datagma data
- [h2] Step 1: Identify lead in Intercom and add the trigger
- [h2] Step 2: Enrich the lead using Datagma
- [h2] Step 3: Prioritize and filter the leads
- [h2] Step 4: Get lead notification on Slack with enriched data
- [h2] Start today and get free credits
  - [h3] Leave a Reply Cancel reply

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
		
	
	
		
			
			
		
	
	
 
			

	

		
		
		 		
		 	

						
		
		How to automate B2B lead prioritization with Datagma and Zapier
		

	Posted on February 11, 2022 by raphaelaz - Uncategorized	 
					
 
				

	
At Datagma, every time someone fills a form (sign up form, newsletter form…), he is sent to our CRM, Intercom.
We created a Zapier automation that will trigger every time a new user appears on Intercom (and so on Datagma): We automatically find all the details about him and his company. Then, based on the criteria defined in Zapier, we assign a score to him.
If the score is high enough, we trigger an alert on Slack to help us engage him as soon as possible.
How you can prioritize lead by leveraging Datagma data
If you’re getting tons of B2B leads and sign ups but can’t follow up with every lead, you need to prioritize your leads.
The problem is that not all leads are equal and not everyone will become your customer. Prioritizing your leads can save you a ton of time and wasted efforts on bad leads or cold leads so that you can focus on the right leads.
Lead prioritization is a method to score and rank your leads based on certain criteria or actions they take, and help you define how valuable a lead is to your business. If you have created an ICP or Ideal Client Profile in your business, then you have already finished the hardest part of automating your lead prioritization.
In this article, we will show you how you can automatically prioritize any lead that comes into your CRM by connecting Datagma through a Zapier integration.
You can do this with any CRM such as Intercom, Pipedrive, Hubspot or even if you have a basic Google spreadsheet as your CRM.
In this lead prioritization process, we want to do 4 steps:

Step 1: Identify lead in Intercom and add the trigger
Step 2: Enrich the lead using Datagma
Step 3: Prioritize and filter the leads
Step 4: Get lead notification on Slack with enriched data

To set up this integration, head over to Zapier and find the Zap for your CRM. We’ll use Intercom for the purpose of this article, but you are free to use any other CRM.

Step 1: Identify lead in Intercom and add the trigger
Connect to your Intercom account and select the trigger as “New user” for intercom. This will trigger the zap when a new user is created on Intercom.

This step will be triggered as soon as there’s a new user which could be a newsletter subscriber or somebody who downloaded a whitepaper.
Step 2: Enrich the lead using Datagma
Find and connect to the Datagma app in Zapier.

Next, select the event: “Find Person or Company”.

This event will find over 75 data points related to the lead and the company such as contact name, LinkedIn profile, Seniority, Job Title, direct dial, their company name, size, company phone, address, technologies used, funding amounts, Alexa Rank, Advertising Platform, traffic sources, exact number of employees, etc.
Enriching your data using Datagma is the key to prioritizing your leads. Once you have all the information about a lead, you can give them a score and take action on the high priority leads.
Next, select the data field that you already have and want to enrich. If you already have their email address, you can use just that to enrich the data. Otherwise, you will need to contact name and their Company Name both to find the rest of the data.
In this case, we are going to input the contact name and company name to enrich our file.

You now may select various options based on what information you want to enrich. For example, in order to get the financial information of the company, you can select the “Full Company” option.
To get the LinkedIn information of the company where your contact works, select the “Company Premium” option.

Step 3: Prioritize and filter the leads
Now that you have enriched data using Datagma and have a lot more data about your lead, you can select the criteria to prioritize leads.
To do this, we will use the app called “Filter by Zapier”.

In this step, we are going to add criteria for filtering out the leads that we don’t want to take action on and only allow leads that fulfill the criteria.
If you already know your Ideal Client Profile (ICP), this step should be easy. Otherwise, take some time to define who the right leads are for your business.
Just to give you an example, we want to be notified when a lead is either an owner or a C-level executive in a SaaS CRM company.
To do this, we are going to say continue if only:
the company has a CRM tag attached to it and the contact is an executive
OR the company has a SaaS tag attached to it and the contact is an executive
OR the company has a CRM tag attached to it and the contact is the Owner.
You can see how we configured it below:

In order to keep this easy, we are showing you a simple filter but feel free to create filters with several criteria such as:
Filter leads from anyone in a company that raised $10M
Filter leads whose role is Marketing and company size is more than 50 employees
Filter leads who is VP Sales in a company with more than 50 employees and uses Intercom tool
Step 4: Get lead notification on Slack with enriched data
In this step, we are simply going to send all the required information of the filtered leads as a message on Slack. For that, select the action “Send Channel Message”.

Next, select the Slack account and the channel where you want the notifications. We selected the “general” channel for this example but you can create a private channel for your leads, if you want to limit access to only a few people in your company.
 
Last thing to do is create a custom message template which will be sent to your Slack channel with the relevant information.
Here you can add as much information as you want depending on what action you want to take after a lead arrives in your Slack channel.
For example, if you want to send them a LinkedIn connection request, add the LinkedIn URL of the lead in the message itself.
Add a phone number, if you want to contact them immediately. And if you want to know which technologies their website is using, you can add that in the message itself.
Take some time to really decide what information will be useful for you to see with your lead notification.

Remember to test and review at each step so that you don’t encounter any problems later on.
If everything works fine and you can see the lead data in the Zapier, you can turn on the zap.
This is how the message will appear in your Slack.

If you get a ton of leads and do not want to spend hours following up with all of them, you need to prioritize your leads. Use this process to prioritize leads based on your ICP and filter out the low-priority leads so that you can focus on converting high-priority leads.

	 
						
	
					
	 
						
	

	
	
	
		
		 Comment * Name * 
Email * 
Website 
 Save my name, email, and website in this browser for the next time I comment.

	
	
	
													
 		 	
		 
		 
		
		

	

	 

	
		Start today and get free credits
	
		
			
					
						
						Try for Free
					
				
			
		

	
		
			
				
									
				 
			
			
				
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

	function check_validate_email() {
 var email = document.getElementById("free_email").value;
 	var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
 if (reg.test(email)){
 document.getElementById("email-submit-free").disabled = false;
 }
		 else{
 document.getElementById("email-submit-free").disabled = true;
 }
}
function send_mail(){
	var input = document.getElementById("free_email").value;
	var obj = new Object();
	obj.user_email = input
	if(input && input.length>0)
	{	
		 $.ajax({
					type: "POST",
					url: "https://kjs1dbpvui.execute-api.us-east-1.amazonaws.com/prod/send-email-admin",
					data: JSON.stringify(obj),
					success: function(response) {
							window.open("https://app.datagma.com/sign-up?email="+input);
					},
					error: function(response) {
						alert("You are not formal customer");
					}
				});
	}
}

×
