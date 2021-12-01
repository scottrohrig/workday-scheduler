var dayEvents = [];

loadTimeBlocks()

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
        createTimeBlock(hour)
    };
}

function createTimeBlock(time) {
    
    // get formatted time
    var fmtTime = setTime(time)
    
    var row = $('<div>').addClass('time-block row justify-content-center');
    row.attr('data-hour', time);

    var hour = $('<p>').addClass('col-2  hour d-flex justify-content-end align-items-center').text(fmtTime)
    var eventText = $('<p>').addClass('col-8 p-2 h-100 bg-light')
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
