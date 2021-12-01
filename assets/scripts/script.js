var dayEvents = {};

loadTimeBlocks()

function saveDayEvents() {
    console.log('saving day events');
}

function setTime(hour) {
    var now = new Date();
        now.setHours(hour);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        now = moment(now).format('hA')
    return now
}

function loadTimeBlocks() {
    // set num of blocks based on type
    var workday = 8;
    var startOfDay = 9;
 
    // make an element for each time block
    for (var i = 0; i < workday; i++) {
        var hour = i + startOfDay;
        dayEvents[hour] = 'To Load From File'
        createTimeBlock(hour)
    };
}

function createTimeBlock(time) {
    
    // get formatted time
    var fmtTime = setTime(time)
    
    var row = $('<div>').addClass('time-block row justify-content-center');
    row.attr('data-hour', time);

    var hour = $('<p>').addClass('col-2  hour d-flex justify-content-end align-items-center').text(fmtTime)
    var eventText = $('<p>').addClass('col-8 p-2 h-100 text-left bg-light event')
    var saveBtn = $('<div>').addClass('col-2  rounded-end h-100 text-light d-flex align-items-center justify-content-center saveBtn').append(
        $('<i>').addClass('uil uil-save')
    )

    row.append(hour, eventText, saveBtn)
    console.log('creating tBlock')
    $('.container').append(row)
}

// on sort events
// $('.container').sortable({
//     connectWith: $('.container .event'),
//     scroll: false,
//     tolerance: 'pointer',
//     helper: 'clone',
//     activate: function(e) {
//         console.log($(this))
//     },
//     update: function(e) {
//         var container = $(this)
//         container.children().each(function (child) {
//             console.log('row', $(this), this.dataset.hour)
//             var row = this
//             row.dataset.hour = child + 9

//         })
//     }
// })

function getRowHour(row) {
    row.children().each(function (child) {
        
    })
}

// on event clicked: edit
// Note: event delegation -> '.time-block'=parent, '.event'=dynamic target element
$('.time-block').on('click','.event', function() {
    console.log('edit clicked')
    // get text
    var text = $(this).text().trim();

    // make regex pattern to replace bg class
    // starts with 'bg-' and any other letter (\w) and NOT white space (\S)
    // var regex = /bg-[\w\S]+/g  
    var classList = $(this).attr('class')//.replace(regex, 'bg-white')

    // make textarea element
    var textInput = $('<textarea>').addClass(classList).val(text);
    // swap elements
    $(this).replaceWith(textInput);
    textInput.trigger('focus');

});



// save button pressed
$('.time-block').on('click','.saveBtn', function() {

    // get row's hour id
    var timeBlock = $(this).parents('.time-block')
    
    // console.log('saveBtn clicked', timeBlock.attr('data-hour'));
    var text = revertTextArea(timeBlock);
    
    // save dayEvents
    var hour = timeBlock.attr('data-hour')
    dayEvents[hour] = text;
    saveDayEvents();
})


// swap textarea back to <p>; 
// Returns text content of textarea
function revertTextArea(timeBlock) {
    
    // get textarea ele
    var textArea = timeBlock.find('textarea');
    var text = textArea.val();
    if (text) {
        text = text.trim();
    }
    
    // make p element
    var eventP = $('<p>').addClass($(textArea).attr('class')).text(text);
    // swap elements
    textArea.replaceWith(eventP);

    return text;
}