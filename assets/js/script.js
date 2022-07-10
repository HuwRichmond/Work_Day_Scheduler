var text_Hour = 9;
var text_Suffix = ":00am";

var storedBlocks = [];
var storedBlocks_NAME = "Stored Blocks";
//this function is for the colour associated withdate/time display at the top of the webpage
function setBGColor($div, currentTime, textTime)
{
    var iTime_CUR = currentTime.split("");
    var iTime_TXT = textTime.split("");

    if(iTime_CUR[iTime_CUR.length - 2] !== iTime_TXT[iTime_TXT.length - 2])
    {
        if(iTime_CUR[iTime_CUR.length - 2] > iTime_TXT[iTime_TXT.length - 2])
        {
            console.log("p > a");
            $div.addClass("bg-secondary");
        }
        else
        {
            console.log("p < a");
            $div.addClass("bg-primary");
        }
    }
    else
    {
        console.log("same time of day");

        var t_CUR = parseHour(iTime_CUR);
        var t_TXT = parseHour(iTime_TXT);

        if(parseInt(t_CUR) > parseInt(t_TXT))
        {
            console.log("current greater");
            $div.addClass("bg-secondary");
        }
        else if(parseInt(t_CUR) < parseInt(t_TXT))
        {
            if(parseInt(t_TXT) === 12)
            {
                console.log("current greater");
                $div.addClass("bg-secondary");
            }
            else
            {
                console.log("current less");
                $div.addClass("bg-primary");
            }
        }
        else
        {
            $div.addClass("bg-warning");
        }
    }
}

function generateHourBlock(iterations)
{
    if(!iterations)
    {
        iterations = 1;
    }
//this variable is designed to display the current hour timeslot on the day planner relative to what time of day it is
    var currentTime = GetCurrentHour("LT");

    for(var i = 0; i < iterations; i++)
    {
        var text_time = text_Hour + text_Suffix;

        $iBlock = $("<div>").addClass("row py-1");
    
        $iTimeText = $("<h5>").addClass("text-center").text(text_time);
        $iTimeDiv = $("<div>").addClass("col-2 py-3 bg-warning align-middle").append($iTimeText);

        $iTextDiv = $("<textarea>").addClass("col-8 py-3 overflow-auto").text("").attr("id", text_time);
        setBGColor($iTextDiv, currentTime, text_time);
    
        $iLockIcon = $("<span>").addClass("lock");

        $iLockDiv = $("<div>").addClass("col-1 py-3 lock-container border border-primary").append($iLockIcon);
        
        $iLockIcon.toggleClass('unlocked');
    
        $iBlock.append($iTimeDiv, $iTextDiv, $iLockDiv);
    
        $("#planner").append($iBlock);
    
        incrementTextHour();
    }

}
//this function sets the increment icrease of the time indicator to show seconds and to increase by the second.
function incrementTextHour()
{
    if(text_Hour === 12)
    {
        text_Hour = 1;
    }
    else if(text_Hour === 11)
    {
        text_Suffix = ":00pm";
        text_Hour++;
    } else
    {
        text_Hour++;
    }
}

//this function uses moment js to find and dispaly the current date
function DisplayDate(pFormat)
{
    var date = moment().format(pFormat);

    $("#current-date").text(date);
}
//this function uses moment js to find and display the proper time at the top of the screen. it is set to display time as AM if it is morning and PM if afternoon
function GetCurrentHour(pFormat)
{
    var time = moment().format(pFormat).toLowerCase();

    time = time.split("");

    var suffix = "";

    var hour = parseHour(time);

    console.log(hour);

    if(time[time.length - 2] === "p")
    {
        console.log("afternoon");
        suffix = ":00pm";
    }
    else
    {
        console.log("morning");
        suffix = ":00am";
    }

    console.log(hour + suffix);
    return hour + suffix;
}

function parseHour(pTime)
{
    var i = 0;
    var iHour = "";

    while(pTime[i] !== ":" || i > 100)
    {
        iHour += pTime[i];
        i++;
    }

    return iHour;
}

function AlterStoredBlocks(pText, pID)
{
    nBlock = {
        id : pID,
        input : pText.trim()
    }

    for(var i = 0; i < storedBlocks.length; i++)
    {
        if(storedBlocks[i].id === nBlock.id)
        {
            storedBlocks.splice(i, 1);

            localStorage.setItem(storedBlocks_NAME, JSON.stringify(storedBlocks));

            return null;
        }
    }

    storedBlocks.push(nBlock);

    localStorage.setItem(storedBlocks_NAME, JSON.stringify(storedBlocks));
}

//this is the function to retrieve saved items on the planner from local storage so they can be displayed again when the website is opened again or refreshed
function GetStoredBlocks()
{

    if(localStorage.getItem(storedBlocks_NAME))
    {
        storedBlocks = JSON.parse(localStorage.getItem(storedBlocks_NAME));

        storedBlocks.forEach(iBlock => {
           
            iID = "#" + iBlock.id;

            $iBlock = $(document.getElementById(iBlock.id));

            $iBlock.val(iBlock.input);

            $iLock = $(($iBlock).parent().children().children()[1])
            
            $iLock.toggleClass("unlocked");

        });

    }

}

generateHourBlock(9);
DisplayDate("LLLL");
GetStoredBlocks();
//this is the function for the lock/unlock button

$(".lock").click(function() {
    console.log("lock clicked");


    $(this).toggleClass('unlocked');

    $iTextArea = $($(this).parent().parent().children()[1]);

    iInput = $iTextArea.val();
    iID = $iTextArea.attr("id");

    AlterStoredBlocks(iInput, iID);
  });


//Main//