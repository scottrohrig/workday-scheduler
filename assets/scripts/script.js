var dayEvents = {};

var bgTypes = ['bg-white','bg-light', 'past', 'present', 'future']

var workday = 8;
var startOfDay = 9;

loadDayEvents();

function saveDayEvents() {
    console.log('saving day events');
    localStorage.setItem('dayEvents', JSON.stringify(dayEvents))
}

function loadDayEvents() {
    var events = JSON.parse(localStorage.getItem('dayEvents'));

    if (!events) {
        events = {};
    }

    for (var i = 0; i < workday; i++) {
        var hour = i + startOfDay;
        dayEvents[hour] = events[hour];
        createTimeBlock(hour, events[hour])
    }
}

function getFormattedTime(hour) {
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
        createTimeBlock(hour);
    };

}

function createTimeBlock(time, text) {
    
    // get formatted time
    var fmtTime = getFormattedTime(time)
    
    var row = $('<div>').addClass('time-block row justify-content-center');
    row.attr('data-hour', time);

    var hour = $('<p>').addClass('col-2  hour d-flex justify-content-end align-items-center').text(fmtTime)
    var eventText = $('<p>').addClass('col-8 p-2 h-100 text-left bg-light event')
    eventText.text(text);
    var saveBtn = $('<div>').addClass('col-2  rounded-end h-100 text-light d-flex align-items-center justify-content-center saveBtn').append(
        $('<i>').addClass('uil uil-save')
    )
    auditEvents($(row), $(eventText))
    row.append(hour, eventText, saveBtn)
    console.log('creating tBlock')
    $('.container').append(row)
}


function removeBgStyles(ele) {
    bgTypes.forEach(function(color) {
        ele.removeClass(color);
    })
}

function auditEvents(timeBlock, eventEl) {

    // get current time
    var now = new Date().getHours()

    // get required elements
    var data = timeBlock.attr('data-hour');

    // set element colors
    if (data > now) {
        removeBgStyles(eventEl);
        eventEl.addClass('future');
    } else if (data == now) {
        removeBgStyles(eventEl);
        eventEl.addClass('present');
    } else if (data < now) {
        removeBgStyles(eventEl);
        eventEl.addClass('past');
    } 
}

// returns time-block's event text content
function getEventText(timeBlock){
    var textEl = timeBlock.children('.event');
    var text = '';
    if (textEl.is('textarea')) {
        text = textEl.val();
    } else {
        text = textEl.text();
    }
    return text;
}

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
    auditEvents(timeBlock, eventP)
    // swap elements
    textArea.replaceWith(eventP);

    return text;
}

// on sort events
$('.container').sortable({
    connectWith: $('.container .event'),
    scroll: false,
    tolerance: 'pointer',
    helper: 'clone',
    activate: function(e) {
        console.log($(this))
    },
    update: function(e) {
        var container = $(this)
        // loop thru time-blocks
        container.children().each(function (child) {
            // console.log('row', $(this), this.dataset.hour)
            var hour = child + startOfDay;
            var fmtHour = getFormattedTime(hour);

            var row = this;
            row.dataset.hour = hour;

            var hourEl = $(row).children('.hour');
            hourEl.text(fmtHour);

            var eventEl = $(row).children('.event');

            dayEvents[hour] = getEventText($(row));

            auditEvents($(row), $(eventEl))

        });

        // save data
        saveDayEvents();

    }
})

// on event clicked: edit
// Note: event delegation -> '.time-block'=parent, '.event'=dynamic target element
$('.time-block').on('click','.event', function() {
    console.log('edit clicked')
    // get text
    var text = $(this).text().trim();

    // replace bg class
    removeBgStyles($(this))
    var classList = $(this).attr('class')//.replace(regex, 'bg-white')

    // make textarea element
    var textInput = $('<textarea>').addClass(classList, 'bg-white').val(text);
    // swap elements
    $(this).replaceWith(textInput);
    textInput.trigger('focus');

});

$('.time-block').on('blur','.event',function() {
    revertTextArea($(this).parents('.time-block'))
});



// save button pressed
$('.time-block').on('click','.saveBtn', function() {
    // ERROR: When save click while Failed to execute 'replaceChild' on 'Node': The node to be removed is no longer a child of this node. Perhaps it was moved in a 'blur' event handler?

    // get row's hour id
    var timeBlock = $(this).parents('.time-block')
    
    var text = getEventText(timeBlock);  
    
    // save dayEvents
    var hour = timeBlock.attr('data-hour')
    dayEvents[hour] = text;
    saveDayEvents();

});


