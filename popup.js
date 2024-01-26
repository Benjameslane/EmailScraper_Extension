let scrapeEmails = document.getElementById('scrapeEmails');
let list = document.getElementById('emailList');

// Handler to recieve email;s from content script
chrome.runtime.onMessage.addListener((request,
    sender,sendResponse) => {

        // Get Emails
        let emails = request.emails;

        // Display emails on popup
        if(emails ==null || emails.length == 0) {
            // No Emails
            let li = document.createElement('li');
            li.innerText = "No Emails Found";
            list.appendChild(li);

        } else {
            //Display Emails
            emails.forEach((email) => {
            let li = document.createElement('li');
            li.innerText = email;
            list.appendChild(li);
            });
        }

    });

    //Button's click event listener
scrapeEmails.addEventListener("click", async () => {

    // Get current active tab on Chrome Window
    let [tab] = await chrome.tabs.query({active: 
    true, currentWindow: true});

    // Execute script to parse emails on page
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: scrapeEmailsFromPage,
    });
})

// Function to Scrape Emails
function scrapeEmailsFromPage() {
    
    // RegEx to parse emails from html code
    const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

    // Parse emails from the HTML of the page
    let emails = document.body.innerHTML.match
    (emailRegEx);

    // send emails to popup
    chrome.runtime.sendMessage({emails});


}