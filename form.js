// Configuration for Firebase backend
let config = {
    apiKey: "AIzaSyAVtgOh4mOfvQVko0yXvv5hMszIB32-eIY",
    authDomain: "keyword-fruit-association.firebaseapp.com",
    projectId: "keyword-fruit-association",
    storageBucket: "keyword-fruit-association.appspot.com",
    messagingSenderId: "152937132493",
    appId: "1:152937132493:web:d0711c4627af0efca91484",
    measurementId: "G-K1Z44EHRYL"
};

// Initialises the Firebase backend
firebase.initializeApp(config);

// Gets reference to the Firebase database
let dbRef = firebase.database().ref();

// Loads the web page
$(window).on("load", function() {
    let keyword = $("#keyword");
    let fruit = $("#fruit");

    // Updates the dropdown list based on any input changes to the keyword
    $(keyword).on("input", function() {
        let selected = $("#fruit option:selected");
        updateDropdown(keyword, fruit, selected);
    });

    // Submits keyword-fruit association
    $("#submit").on("click", function() {
        let selected = $("#fruit option:selected");

        // Displays error message if there are missing inputs
        if(keyword.val() == "" || selected.val() == "none") {
          alert("Please enter a keyword and/or select a fruit");
        }
        // Updates or creates keyword-fruit association
        else {
            dbRef.child(keyword.val()).child(selected.text()).once("value", function(snap) {
                let frequency = 1;

                if(snap.exists()) {
                    frequency = snap.val().frequency + 1;
                }

                dbRef.child(keyword.val()).child(selected.text()).set({ frequency : frequency });
            });

            // Updates the dropdown list in case the suggestions changed
            updateDropdown(keyword, fruit, selected);
        }
    });
});

// Updates the dropdown list
async function updateDropdown(keyword, fruit, selected) {
    let fruits = [ "Apple", "Pear", "Orange", "Banana", "Strawberry" ];
    let suggested = [];

    // Retrieves at most the three most suggested fruits based on the keyword
    await dbRef.child(keyword.val()).orderByChild("frequency").limitToLast(3).once("value", function(snap) {
        snap.forEach(function(data) {
            suggested.push(data.key);
        });
    });

    suggested.reverse();

    // Gets the fruits that are not suggested
    let other = fruits.filter(function(x) {
        return suggested.indexOf(x) < 0;
    });

    // Creates new HTML string based on the suggested and other fruits
    let options = "<option value=\"none\" selected disabled hidden>Please Choose...</option><optgroup label=\"Suggested:\">";
    options += addOptions(suggested);
    options += "</optgroup><optgroup label=\"Other Options:\">";
    options += addOptions(other);
    options += "</optgroup>";
    
    // Updates the dropdown list and keeps the previously selected fruit
    fruit.html(options);
    fruit.val(selected.val());
}

// Adds options to the dropdown list
function addOptions(fruits) {
    let options = "";

    $.each(fruits, function(index, value) {
        options += "<option value=\"" + value.toLowerCase() + "\">"+ value + "</option>";
    });

    return options;
}