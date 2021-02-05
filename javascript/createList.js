var people = [{name: "Остап", surname: "Бендер"},
			  {name: "Игнат", surname: "Делюгин"},
			  {name: "Максим", surname: "Дергачев"},
			  {name: "Петр", surname: "Дуров"},
			  {name: "Иван", surname: "Иванов"},
			  {name: "Сергей", surname: "Иванов"},
			  {name: "Ольга", surname: "Ивушина"},
			  {name: "Марианно", surname: "Маринина"},
			  {name: "Ирина", surname: "Мурашова"},
			  {name: "Олег", surname: "Мухин"},
			  {name: "Жан", surname: "Никаноров"},
			  {name: "Иван", surname: "Никитин"},
			  {name: "Петр", surname: "Сергеев"}];
					  
var human = [{name: "Остап", position: "Менеджер"},
			{name: "Игнат", position: "Курьер"},
			{name: "Максим", position: "Иллюстратор"},
			{name: "Петр", position: "Менеджер"},
			{name: "Иван", position: "Водитель"},
			{name: "Сергей", position: "Иллюстратор"},
			{name: "Ольга", position: "Менеджер"},
			{name: "Марианно", position: "Бухгалтер"},
			{name: "Ирина", position: "Бухгалтер"},
			{name: "Олег", position: "Директор"},
			{name: "Жан", position: "Зам.директора"},
			{name: "Иван", position: "Водитель"},
			{name: "Петр", position: "Курьер"}];



(function($){
	$.fn.createList=function(options){
							  
		var list = this;
		//Группировка списка
		var groupBy = function(list, func) {
			return list.reduce(function(rv, x) {
				(rv[func(x)] = rv[func(x)] || []).push(x);
				return rv;
			}, {});
		}; 
		//Создание элемента списка
		function createElem(person) {
			var elem = "<div class='elem'>";
			for (var key in person) {
				if (key == field) {
					elem += "<span class='elem-big'>" + person[key] + "</span>"
				} else {
					elem += person[key];
				}
				elem += " ";
			}
			elem += "</div>"
			return elem;
		}
		var $stickies;
		
		function stickyHeaders(stickies, target) {
			
			if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {

				$stickies = stickies.each(function() {

					var $thisSticky = $(this);
		  
						$thisSticky
							.data('originalPosition', $thisSticky.offset().top)
							.data('originalHeight', $thisSticky.outerHeight()); 			  
				});
				target.off("scroll.stickies").on("scroll.stickies", whenScrolling);
			}			
		}
		
		function whenScrolling(event) {
			
			var $scrollTop = $(event.currentTarget).scrollTop() + $(event.currentTarget).offset().top ;

			$stickies.each(function(i) {			

				var $thisSticky = $(this),
					$stickyPosition = $thisSticky.data('originalPosition'),
					$newPosition,
					$nextSticky;

				if ($stickyPosition <= $scrollTop) {
				
					$newPosition = Math.max(0, $scrollTop - $stickyPosition);
					$nextSticky = $stickies.eq(i + 1);
				
					if($nextSticky.length > 0) {
						$newPosition = Math.min($newPosition, ($nextSticky.data('originalPosition') - $stickyPosition) - $thisSticky.data('originalHeight'));
					}
				} else {
					$newPosition = 0;
				}
				$thisSticky.css('transform', 'translateY(' + $newPosition + 'px)');
			});
		}
		//Создание группированного массива
		var objects = options.data;
		var field = options.keyFiled;
		var func = options.groupingFunction;
		
		var groups = groupBy(objects, func);

		//Печать списка
		Object.keys(groups).sort().forEach(function(key) {
			list.append("<div class='caption'><span class='caption-text'>" + key + "</span></div>");		
			groups[key].forEach(function(person) {
				list.append(createElem(person));
			}) 
		});	
		
		stickyHeaders(list.find(".caption"), list);
		
		return this;
	
	};
})(jQuery);

$(document).ready(function(){

	$('#One').createList({
							data: people,
							keyField: 'surname',
							groupingFunction: function(person){ return person.surname[0] } 
						 });
	$('#Two').createList({
							data: human,
							keyField: 'position',
							groupingFunction: function(person){ return person.position }
						 });

});