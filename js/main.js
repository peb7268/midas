var counter;
window.Page = {};
Page.timer  = 2000;

function addCtaClasses(){
	$('#cta-grid li').each(function(idx, elem){
		counter = (typeof counter == 'undefined') ? 1 : counter + 1;
		var className = getCtaClassName(idx, counter);
		if(counter == 4) counter = 0;
	   	elem.classList.add(className);
	});
}

function getCtaClassName(idx, placement){
	if(placement == 1)  return 'first'; 	//0
   	if(placement == 2)  return 'second';	//1
   	if(placement == 3)  return 'third';		//2
   	if(placement == 4)  return 'fourth';	//3
}

function bindEvents(){
	$('#cta-grid li').on('click', scrollToContent);
	$('.backToTop').on('click', scrollToTop);
}

function scrollToTop(evt){
	evt.preventDefault();

	$('.backToTop').removeClass('active');
	$(window).scrollTo(0, {
		duration: 650
	});
}

function scrollToContent(evt){
	evt.preventDefault();
	var dest = $(evt.currentTarget).data('dest');
	
	$('.highlight').removeClass('highlight');
	$(dest).addClass('highlight');
	$('.backToTop').addClass('active');

	$(window).scrollTo(dest, {
		duration: 650,
		offset: -300
	});

	window.setTimeout(function(){
		$('.highlight').addClass('removeHighlight');
		window.setTimeout(function(){
			$('.highlight').removeAttr('class');
		}, 1200);
	}, Page.timer);
}


(function($){
	$(document).ready(function(){
		addCtaClasses();
		bindEvents();
		$('#cta-grid').isotope();
	});
}(jQuery));