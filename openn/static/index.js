function getRandomClassName(){
        var names = ["Spanish 101","Introduction to Film","Social Psychology","Advanced Criminal Law",
        "Introduction to Statistics","Home Economics","Debate 109","Environmental Science",
        "Comparative Religion","Investigative Journalism","Interpretive Dance",
        "Romantic Expressionism","Communication Studies","Physical Education",
        "Basic Genealogy","Beginner Pottery","The Science of Illusion",
        "Contemporary American Poultry","The Art of Discourse","Modern Warfare",
        "English as a Second Language","Anthropology 101","Accounting for Lawyers",
        "The Psychology of Letting Go","Basic Rocket Science","Messianic Myths and Ancient Peoples",
        "Epidemiology","Aerodynamics of Gender","Cooperative Calligraphy",
        "Conspiracy Theories and Interior Design","Mixology Certification","Celebrity Pharmacology",
        "Advanced Dungeons & Dragons","Early 21st Century Romanticism",
        "Intermediate Documentary Filmmaking","Intro to Political Science",
        "Custody Law and Eastern European Diplomacy","Critical Film Studies",
        "Competitive Wine Tasting","Paradigms of Human Memory",
        "Applied Anthropology and Culinary Arts","Biology 101","Geography of Global Conflict",
        "Remedial Chaos Theory","Competitive Ecology","Studies in Modern Movement",
        "Foosball and Nocturnal Vigilantism","Regional Holiday Music",
        "Contemporary Impressionists","Urban Matrimony and the Sandwich Arts",
        "Digital Exploration of Interior Design","Pillows and Blankets",
        "Origins of Vampire Mythology","Virtual Systems Analysis","Digital Estate Planning",
        "Introduction to Finality","History 101","Paranormal Parentage",
        "Conventions of Space and Time","Alternative History of the German Invasion",
        "Cooperative Escapism in Familial Relations","Advanced Documentary Filmmaking",
        "Economics of Marine Biology","Intro to Felt Surrogacy","Intro to Knots",
        "Basic Human Anatomy","Advanced Introduction to Finality","Introduction to Teaching",
        "Cooperative Polygraphy","Geothermal Escapism","Analysis of Cork-Based Networking",
        "App Development and Condiments","VCR Maintenance and Educational Publishing","Advanced Advanced Dungeons & Dragons"];

        var item = names[Math.floor(Math.random()*names.length)];
        return item;
    };
$(function() {

    $('#signIn .password').keypress(function(e) {
        if (e.which == 13) {
            login();
        }
    });
    $('#signUp .password').keypress(function(e) {
        if (e.which == 13) {
            createUser();
        }
    });

    $('#signIn .button').click(function() {
        login();
    });

    $('#signUp .button').click(function() {
        createUser();
    })
    function setStorage(val) {
        var customEvent = document.createEvent('Event');
        customEvent.initEvent('setUser', true, true);
        hiddenDiv = document.getElementById('setUserEventDiv');
        $('#setUserEventDiv').text(val);
        hiddenDiv.dispatchEvent(customEvent);
    }
    function createUser() {
        $.ajax({
            url: "/create",
            dataType: 'json',
            method: 'GET',
            data: {
                user: $('#signUp .username').val(),
                password: $('#signUp .password').val(),
                // password2: $('#signup-password2').val()
            }
        }).done(function(data) {
            if (data.errors) {
                switch (data.errors) {
                    case 'username_taken':
                        var msg = 'That username is taken!';
                        break;
                    case 'username_none':
                        var msg = 'Please choose a username.';
                        break;
                    case 'pass_none':
                        var msg = 'Please choose a password.';
                        break;
                    default:
                        var msg = 'Sorry, we couldn\'t sign you up!';
                }
                $('#signup-errorbox').text(msg).fadeIn('fast');
            } else {
                // Successful sign-up! Let's refresh the page now after logging the user in on the server-side
                setStorage($('#signUp .username').val());
                location.reload();
            }
        });
    }


    function login() {
        $.ajax({
            url: "/authenticate",
            dataType: 'json',
            method: 'GET',
            data: {
                user: $('#signIn .username').val(),
                password: $('#signIn .password').val()
            }
        }).done(function(data) {
            console.log(data);
            if (data.errors) {
                switch (data.errors) {
                    case 'username_none':
                        var msg = 'Please enter a username.';
                        break;
                    case 'pass_none':
                        var msg = 'Please enter a password.';
                        break;
                    default:
                        var msg = 'Sorry, we couldn\'t sign you in. Check your username and password.';
                }
                $('#signin-errorbox').text(msg).fadeIn('fast');
            } else {
                setStorage($('#signIn .username').val());
                console.log('success');
                // Successful sign-up! Let's refresh the page now after logging the user in on the server-side
                location.reload();
            }
        });
    }

});
