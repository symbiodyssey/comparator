$(document).ready(function() {

cpTable.calculateAllTotals();

$('.cp-table thead th').hover(cpTable.menuAddColumn, cpTable.hideMenu);

$('.cp-crit').hover(cpTable.menuAddRow, cpTable.hideMenu);

$('#showHTML').click(function() {
    cpTable.showHTML();
});

$(".cp-table").keyup(function(e) {

    var node = document.getSelection().anchorNode;


    var clazz = $(node).parent().attr('class');
    if(clazz!=null) {
        if (~clazz.indexOf("cp-score") || ~clazz.indexOf("cp-weight")) {
            cpTable.calculateAllTotals();
        }
    }

    //console.log("Type type type :" + $(node).text());
});


});


var cpTable = (function (mod) {


    /*Calculate all totals of one table*/
    mod.calculateAllTotals = function() {
        var nbRows = $('.cp-table thead tr').children().length-1;
        for(i=0;i<nbRows;i++) {
            this.calculateTotal(i);
        }
        this.bestOption();
    }

    /*Calculate the */
    mod.calculateTotal = function(row) {
        var sum = 0;
        var weight=0;

        $('.cp-table tbody tr').each(function() {
            var ceil = $(this).find('td.cp-score:eq('+row+')');
            sum += Number($(ceil).text()*$(this).find(".cp-weight").text()) || 0;
        });

        $('.cp-weight').each(function() {
          weight += Number($(this).text()) || 0;
        });

        var total = Math.round(((sum)/(weight*100))*100);
        $('.cp-table td.cp-total:eq('+row+')').text(total);

    }

    /*Add class cp-best to the best option, the column with the highest score of one table*/
    mod.bestOption = function() {
        $('.cp-table .cp-total').removeClass('cp-best');

        var firstChild = $('.cp-table .cp-total:first-child');
        var position=$(firstChild).index();
        var tot=Number($(firstChild).text()) || 0;
        var newTot;
        $('.cp-table .cp-total').each(function() {
          newTot = Number($(this).text()) || 0;
          if(newTot>tot) {
              tot=newTot;
              position=$(this).index();
          }
        });

        $('.cp-table .cp-total:nth-child('+(position+1)+')').addClass('cp-best');
    }

    /*Show HTML code of the comparator tables*/
    mod.showHTML = function(){
        document.getElementById('htmlcode').value = document.getElementById('comparator').innerHTML;
    }

    /*Add a column at position 'index'*/
    mod.addColumn = function(index) {
        var th = $('<th colspan="2">Application 2</th>');
        $('.cp-table thead tr th:nth-child('+(index)+')').after(th);
        $('.cp-table tbody tr:nth-child(odd) td:nth-child('+(index)+')').after('<td colspan="2" class="cp-descr">Buttons have no labels</td>');
        $('.cp-table tbody tr:nth-child(even) td:nth-child('+(index*2)+')').after('<th class="cp-lbl-score">Score :</th><td class="cp-score">70</td>');
        $('.cp-table tfoot tr td:nth-child('+(index*2-1)+')').after('<td>Total :</td><td class="cp-total"></td>');

        $(th).hover(this.menuAddColumn, this.hideMenu);

        this.calculateAllTotals();
    }

    /*Add a row at position 'index' start at 1*/
    mod.addRow = function(index) {
        console.log("add row:" + index);

        var tr = $('<tr><td colspan="2" class="cp-crit">Design</td></tr>');
        $(tr).find('.cp-crit').hover(this.menuAddRow, this.hideMenu);

        var nbRows = $('.cp-table thead tr').children().length-1;


        if(index <= 1) {
            $('.cp-table tbody').prepend(tr);

            for(i=0;i<nbRows;i++) {
                $('.cp-table tbody tr:nth-child('+(1)+')').append('<td colspan="2" class="cp-descr">Buttons have no labels</td>');
            }

            $('.cp-table tbody tr:first-child').after('<tr><th class="cp-lbl-weight">Weight :</th><td class="cp-weight">5</td></tr>');
            for(i=0;i<nbRows;i++) {
                $('.cp-table tbody tr:nth-child('+(1)+')').append('<th class="cp-lbl-score">Score :</th><td class="cp-score">70</td>');
            }
        } else {
            $('.cp-table tbody tr:nth-child('+(index*2-2)+')').after(tr);
            console.log("position:"+(index*2-2))

            for(i=0;i<nbRows;i++) {
                $('.cp-table tbody tr:nth-child('+(index*2-1)+')').append('<td colspan="2" class="cp-descr">Buttons have no labels</td>');
            }

            $('.cp-table tbody tr:nth-child('+(index*2-1)+')').after('<tr><th class="cp-lbl-weight">Weight :</th><td class="cp-weight">5</td></tr>');
            for(i=0;i<nbRows;i++) {
                $('.cp-table tbody tr:nth-child('+(index*2)+')').append('<th class="cp-lbl-score">Score :</th><td class="cp-score">70</td>');
            }
        }
        this.calculateAllTotals();
    }

    /*Remove column at position 'index' start at 1*/
    mod.removeColumn = function(index) {
        $('.cp-table thead th:nth-child('+(index+1)+')').remove();
        $('.cp-table tbody tr:nth-child(odd) td:nth-child('+(index+1)+')').remove();
        $('.cp-table tbody tr:nth-child(even) th:nth-child('+(index+2)+')').remove();
        $('.cp-table tbody tr:nth-child(even) td:nth-child('+(index+2)+')').remove();
        $('.cp-table tfoot tr td:nth-child('+(index*2)+')').remove();
        $('.cp-table tfoot tr td:nth-child('+(index*2)+')').remove();
        this.calculateAllTotals();
    }

    /*Remove row at position 'index' start at 1*/
    mod.removeRow = function(index) {
        $('.cp-table tbody tr:nth-child('+(index*2-1)+')').remove();
        $('.cp-table tbody tr:nth-child('+(index*2-1)+')').remove();
        this. calculateAllTotals();
    }

    mod.menuAddColumn = function() {
        $(this).append('<div class="cp-menu"><span onclick="cpTable.addColumn('+($(this).index()+1)+')"><i class="fas fa-plus"></i></span><span onclick="cpTable.removeColumn('+($(this).index())+')"><i class="fas fa-minus"></i></span></div>');
    }

    mod.menuAddRow = function() {
        $(this).append('<div class="cp-menu"><span onclick="cpTable.addRow('+($(this).parent().index()/2+2)+')"><i class="fas fa-plus"></i></span><span onclick="cpTable.removeRow('+($(this).parent().index()+1)+')"><i class="fas fa-minus"></i></span></div>');
    }

    mod.hideMenu = function() {
        $(".cp-menu").remove();
    }

    return mod;
})(cpTable || {});
