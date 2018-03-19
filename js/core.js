$(document).ready(function() {

cpTable.calculateAllTotals($('.cp-container'));

$('.cp-table thead th:first-child').hover(cpTable.menuAddRowAndColumn, cpTable.hideMenu);
$('.cp-table thead th:nth-child(n+2)').hover(cpTable.menuAddColumn, cpTable.hideMenu);

$('.cp-crit').hover(cpTable.menuAddRow, cpTable.hideMenu);

$('#showHTML').click(function() {
    cpTable.showHTML();
});

$(".cp-container").keyup(function(e) {

    var node = $(document.getSelection().anchorNode).parent();

    if($(node).is('.cp-container thead th ')) {
        var index = $(node).index();
        if(index==0) {
            $('.cp-table thead th:nth-child('+(index+1)+')').not(node).text($(node).text());
        } else {
            $('.cp-container thead th:nth-child('+(index+1)+')').not(node).text($(node).text());
        }
    } else if($(node).is('.cp-lbl-weight')) {
        $('.cp-lbl-weight').not(node).text($(node).text());
    }  else if($(node).is('.cp-lbl-score')) {
        $('.cp-lbl-score').not(node).text($(node).text());
    }else if($(node).is('.cp-lbl-total')) {
        $('.cp-lbl-total').not(node).text($(node).text());
    }else if($(node).is('.cp-score') || $(node).is('.cp-weight')){
        cpTable.calculateAllTotals('.cp-container');
    }

    //console.log("Type type type :" + $(node).text());
});


});


var cpTable = (function (mod) {

    /*Calculate the totals for each table*/
    mod.calculateAllTotals = function(container) {
        $(container).find('table').each(function() {
            mod.calculateTableTotals($(this));
        });
        mod.calculateGreatTotals(container);
    }

    /*Calculate all totals of one table*/
    mod.calculateTableTotals = function(table) {
        var nbColumns = $(table).find('thead tr').children().length-1;
        for(i=0;i<nbColumns;i++) {
            this.calculateTotal(table, i);
        }
        this.bestOption(table);
    }

    /*Calculate the total of one table*/
    mod.calculateTotal = function(table, column) {
        var sum = 0;
        var weight=0;

        $(table).find('tbody tr').each(function() {
            var ceil = $(this).find('td.cp-score:eq('+column+')');
            sum += Number($(ceil).text()*$(this).find(".cp-weight").text()) || 0;
        });

        $(table).find('.cp-weight').each(function() {
          weight += Number($(this).text()) || 0;
        });

        var total = Math.round(((sum)/(weight*100))*100);
        $(table).find('td.cp-total:eq('+column+')').text(total || 0);

    }

    /*Calculate great totals*/
    mod.calculateGreatTotals = function(container) {
        var sum = 0;
        var weight=0;

        var nbColumns = $(container).find('.cp-tbl-total thead tr').children().length-1;
        for(i=0;i<nbColumns;i++) {
            sum=0;
            weight=0;
            $(container).find('.cp-table tbody tr').each(function() {
                var ceil = $(this).find('td.cp-score:eq('+i+')');
                sum += Number($(ceil).text()*$(this).find(".cp-weight").text()) || 0;
            });

            $(container).find('.cp-table .cp-weight').each(function() {
              weight += Number($(this).text()) || 0;
            });

            var total = Math.round(((sum)/(weight*100))*100);
            $(container).find('td.cp-great-total:eq('+(i)+')').text(total || 0);
        }

        this.bestGreatTotalOption(container);
    }

    mod.bestGreatTotalOption = function(container) {
        $(container).find('.cp-great-total').removeClass('cp-best');

        var firstChild = $(container).find('.cp-great-total:first-child');
        var position=$(firstChild).index();
        var tot=Number($(firstChild).text()) || 0;
        var newTot;
        $(container).find('.cp-great-total').each(function() {
          newTot = Number($(this).text()) || 0;
          if(newTot>tot) {
              tot=newTot;
              position=$(this).index();
          }
        });

        $(container).find('.cp-great-total:nth-child('+(position+1)+')').addClass('cp-best');
    }

    /*Add class cp-best to the best option, the column with the highest score of one table*/
    mod.bestOption = function(table) {
        $(table).find('.cp-total').removeClass('cp-best');

        var firstChild = $(table).find('.cp-total:first-child');
        var position=$(firstChild).index();
        var tot=Number($(firstChild).text()) || 0;
        var newTot;
        $(table).find('.cp-total').each(function() {
          newTot = Number($(this).text()) || 0;
          if(newTot>tot) {
              tot=newTot;
              position=$(this).index();
          }
        });

        $(table).find('.cp-total:nth-child('+(position+1)+')').addClass('cp-best');
    }

    /*Show HTML code of the comparator tables*/
    mod.showHTML = function(){
        document.getElementById('htmlcode').value = document.getElementById('comparator').innerHTML;
    }

    /*Add a column at position 'index'*/
    mod.addColumn = function(index) {
        var th = $('<th colspan="2">New item</th>');
        $('.cp-table thead tr th:nth-child('+(index)+')').after(th);
        $('.cp-table tbody tr:nth-child(odd) td:nth-child('+(index)+')').after('<td colspan="2" class="cp-descr">New comment</td>');
        $('.cp-table tbody tr:nth-child(even) td:nth-child('+(index*2)+')').after('<th class="cp-lbl-score">Score :</th><td class="cp-score">0</td>');
        $('.cp-table tfoot tr td:nth-child('+(index*2-1)+')').after('<td class="cp-lbl-total">Total :</td><td class="cp-total"></td>');

        $('.cp-table thead tr th:nth-child('+(index+1)+')').hover(this.menuAddColumn, this.hideMenu);

        $('.cp-tbl-total thead tr th:nth-child('+(index)+')').after('<th>New item</th>');
        if(index==1) {
            $('.cp-tbl-total tbody tr th').after('<td class="cp-great-total"></td>');
        } else {
            $('.cp-tbl-total tbody tr td:nth-child('+(index)+')').after('<td class="cp-great-total"></td>');
        }

        this.calculateAllTotals('.cp-container');
    }

    /*Add a row at position 'index' start at 1*/
    mod.addRow = function(table, index) {
        var tr = $('<tr><td colspan="2" class="cp-crit">New criterion</td></tr>');
        $(tr).find('.cp-crit').hover(this.menuAddRow, this.hideMenu);

        var nbRows = $(table).find(' thead tr').children().length-1;


        if(index <= 1) {
            $(table).find('tbody').prepend(tr);

            for(i=0;i<nbRows;i++) {
                $(table).find(' tbody tr:nth-child('+(1)+')').append('<td colspan="2" class="cp-descr">New comment</td>');
            }

            $(table).find('tbody tr:first-child').after('<tr><th class="cp-lbl-weight">Weight :</th><td class="cp-weight">0</td></tr>');
            for(i=0;i<nbRows;i++) {
                $(table).find(' tbody tr:nth-child('+(2)+')').append('<th class="cp-lbl-score">Score :</th><td class="cp-score">0</td>');
            }
        } else {
            $(table).find(' tbody tr:nth-child('+(index*2-2)+')').after(tr);

            for(i=0;i<nbRows;i++) {
                $(table).find(' tbody tr:nth-child('+(index*2-1)+')').append('<td colspan="2" class="cp-descr">New comment</td>');
            }

            $(table).find(' tbody tr:nth-child('+(index*2-1)+')').after('<tr><th class="cp-lbl-weight">Weight :</th><td class="cp-weight">0</td></tr>');
            for(i=0;i<nbRows;i++) {
                $(table).find(' tbody tr:nth-child('+(index*2)+')').append('<th class="cp-lbl-score">Score :</th><td class="cp-score">0</td>');
            }
        }
        this.calculateAllTotals('.cp-container');
    }

    /*Remove column at position 'index' start at 1*/
    mod.removeColumn = function(index) {
        console.log("index:"+index);
        $('.cp-table thead th:nth-child('+(index+1)+')').remove();
        $('.cp-table tbody tr:nth-child(odd) td:nth-child('+(index+1)+')').remove();
        $('.cp-table tbody tr:nth-child(even) th:nth-child('+(index*2+1)+')').remove();
        $('.cp-table tbody tr:nth-child(even) td:nth-child('+(index*2+1)+')').remove();
        $('.cp-table tfoot tr td:nth-child('+(index*2)+')').remove();
        $('.cp-table tfoot tr td:nth-child('+(index*2)+')').remove();

        $('.cp-tbl-total thead th:nth-child('+(index+1)+')').remove();
        $('.cp-tbl-total tbody td:nth-child('+(index+1)+')').remove();
        this.calculateAllTotals('.cp-container');
    }

    /*Remove row at position 'index' start at 1*/
    mod.removeRow = function(table, index) {
        $(table).find('tbody tr:nth-child('+(index*2-1)+')').remove();
        $(table).find('tbody tr:nth-child('+(index*2-1)+')').remove();
        this.calculateAllTotals('.cp-container');
    }

    mod.menuAddColumn = function() {
        $(this).append('<div class="cp-menu"><span onclick="cpTable.addColumn('+($(this).index()+1)+')"><i class="fas fa-plus"></i></span><span onclick="cpTable.removeColumn('+($(this).index())+')"><i class="fas fa-minus"></i></span></div>');
    }

    mod.menuAddRow = function(table) {
        var table = $(this).closest('table');
        var addBtn = $('<span><i class="fas fa-plus"></i></span>');
        console.log("index:"+($(this).parent().index()/2+2));
        var pos = ($(this).parent().index()/2+2);
        $(addBtn).click(function() {mod.addRow(table, (pos))});

        var remBtn = $('<span><i class="fas fa-minus"></i></span>');
        $(remBtn).click(function() {mod.removeRow(table, (pos-1))});

        var menu = $('<div class="cp-menu"></div>');
        $(menu).append(addBtn);
        $(menu).append(remBtn);
        $(this).append(menu);
    }

    mod.menuAddRowAndColumn = function() {
        var table = $(this).closest('table');
        var addBtn = $('<span><i class="fas fa-arrow-down"></i></span>');
        $(addBtn).click(function() {mod.addRow(table, (1))});

        var remBtn = $('<span><i class="fas fa-arrow-right"></i></span>');
        $(remBtn).click(function() {mod.addColumn(1)});

        var menu = $('<div class="cp-menu"></div>');
        $(menu).append(addBtn);
        $(menu).append(remBtn);
        $(this).append(menu);

        //$(this).append('<div class="cp-menu"><span onclick="cpTable.addRow('+$(this).parent('table'), (1)+')"><i class="fas fa-arrow-down"></i></span><span onclick="cpTable.addColumn('+(1)+')"><i class="fas fa-arrow-right"></i></span></div>');
    }

    mod.hideMenu = function() {
        $(".cp-menu").remove();
    }

    return mod;
})(cpTable || {});
