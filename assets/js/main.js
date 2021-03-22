//Global Variables
const API_URL = "http://localhost/petct-armenia/website/petct-back/public/api/admin";

let url = window.location.href.split("/");
url = url[url.length - 1];

if (url.includes("?")) {
    url = url.split("?");
    url = url[0];
}

function setLang (name) {
    if (name === 1) {
        return "Հայ";
    } else if (name === 2) {
        return "En";
    } else {
        return "Ру";
    }
}

let id = window.location.href.split("id=");
id = id[id.length - 1];
var htmlRootFolderPath = "http://"+ document.location.hostname + "/petct-armenia/admin-page/html";

if (localStorage.getItem('appname_token')) {
$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	});

	jQuery('.selectpicker').selectpicker;

	$('.addfiles').on('click', function() { 
		$('#fileupload').click();
		return false;
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	$('.equal-height').matchHeight({
		property: 'max-height'
	});

	// Counter Number
	$('.count').each(function () {
		$(this).prop('Counter',0).animate({
			Counter: $(this).text()
		}, {
			duration: 3000,
			easing: 'swing',
			step: function (now) {
				$(this).text(Math.ceil(now));
			}
		});
	});

	// Menu Trigger
	$('#menuToggle').on('click', function(event) {
		var windowWidth = $(window).width();   		 
		if (windowWidth<1010) { 
			$('body').removeClass('open'); 
			if (windowWidth<760){ 
				$('#left-panel').slideToggle(); 
			} else {
				$('#left-panel').toggleClass('open-menu');  
			} 
		} else {
			$('body').toggleClass('open');
			$('#left-panel').removeClass('open-menu');  
		} 
			 
	});
	 
	$(".menu-item-has-children.dropdown").each(function() {
		$(this).on('click', function() {
			var $temp_text = $(this).children('.dropdown-toggle').html();
			$(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>'); 
		});
	});

	// Load Resize 
	$(window).on("load resize", function(event) { 
		var windowWidth = $(window).width();  		 
		if (windowWidth<1010) {
			$('body').addClass('small-device'); 
		} else {
			$('body').removeClass('small-device');  
		}
	});
});

var split = window.location.href.split('/');
var isActive = split[split.length - 1];

document.getElementById("main-menu").innerHTML += `
<ul class="nav navbar-nav">
	<li class="${isActive.includes("index") || isActive === "" ? "active" : ''}">
		<a href="${htmlRootFolderPath}/index/index"> 
			<i class="menu-icon fa fa-cogs"></i>Գլխավոր
		</a>
	</li>

	<li class="menu-item-has-children dropdown ${isActive.includes("spect") || isActive.includes("pet") ? "active" : ''}">
		<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
			<i class="menu-icon fa fa-cogs"></i>Հետազոտություններ
		</a>

		<ul class="sub-menu children dropdown-menu">
			<li><i class="fa fa-table"></i><a href="${htmlRootFolderPath}/pet/pet">PET/CT հետազոտություն</a></li>
			<li><i class="fa fa-table"></i><a href="${htmlRootFolderPath}/spect/spect">SPECT/CT հետազոտություն</a></li>
		</ul>
	</li>

	<li class=${isActive.includes("price") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/price/price"> 
			<i class="menu-icon fa fa-cogs"></i>Գնացուցակ
		</a>
	</li>

	<li class=${isActive.includes("doctor") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/doctor/doctors">
			<i class="menu-icon fa fa-cogs"></i>Բժիշկներ
		</a>
	</li>

	<li class=${isActive.includes("news") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/news/news">
			<i class="menu-icon fa fa-cogs"></i>Նորություններ
		</a>
	</li>

	<li class=${isActive.includes("gallery") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/gallery/gallery">
			<i class="menu-icon fa fa-cogs"></i>Նկարներ
		</a>
	</li>

	<li class=${isActive.includes("faq") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/faq/faq"> 
			<i class="menu-icon fa fa-cogs"></i>ՀՏՀ
		</a>
	</li>

	<li class=${isActive.includes("press") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/press/press">
			<i class="menu-icon fa fa-cogs"></i>Մամուլ
		</a>
	</li>

	<li class=${isActive.includes("advantages") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/advantages/advantages"> 
			<i class="menu-icon fa fa-cogs"></i>Մեր առավելությունները
		</a>
	</li>

	<li class=${isActive.includes("contact") ? "active" : ''}>
		<a href=${htmlRootFolderPath}/contact/contacts> 
			<i class="menu-icon fa fa-cogs"></i>Կապ
		</a>
	</li>

	<li>
		<hr />
	</li>

	<li class=${isActive.includes("email") ? "active" : ''}>
		<a href="${htmlRootFolderPath}/email/email"> 
			<i class="menu-icon fa fa-envelope"></i>Նամակներ
		</a>
	</li>
</ul>
`;

document.getElementById("header").innerHTML += `
<div class="top-left">
                <div class="navbar-header">
                    <a class="navbar-brand" href="https://petct-armenia.am" target="_blank">
                        <h4> petct-armenia.am </h4>
                    </a>
                    <a id="menuToggle" class="menutoggle"><i class="fa fa-bars"></i></a>
                </div>
			</div>
			
<div class="top-right">
<div class="header-menu">

	<div class="user-area dropdown float-right">
		<a href="#" class="dropdown-toggle active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			<img class="user-avatar rounded-circle" src="../../images/logo.png">
		</a>

		<div class="user-menu dropdown-menu">
			<a class="nav-link" href="#" id="logoutBtn"><i class="fa fa-power -off"></i>Դուրս գալ</a>
		</div>
	</div>

</div>
</div>
`;

document.getElementById("logoutBtn").addEventListener("click", function (e) {
	e.preventDefault();
	localStorage.removeItem("appname_token");
	window.location.href = "login";
});

document.getElementsByClassName("site-footer")[0].innerHTML = "";

document.getElementsByClassName("site-footer")[0].innerHTML = `
	<div class="footer-inner bg-white">
		<div class="row">
			<div class="col-sm-12">
				Նախագծող՝ <a href="https://narek-webdev.github.io/site" target="_blank">https://narek-webdev.github.io</a>
			</div>
		</div>
	</div>
`;

} else {
	window.location.href = htmlRootFolderPath + "/auth/login";
}