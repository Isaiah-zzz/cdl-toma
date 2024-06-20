function sendDataToServer(data) {
    // Get the jsPsych data in CSV format
    // const csvData = jsPsych.data.get().csv();

    // Send the data to the server
    fetch('http://147.182.195.234:3000/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

const jsPsych = initJsPsych({
    on_finish: function () {
        jsPsych.data.displayData('json');

        const kid_info = jsPsych.data.get().filter({label: 'info'})["trials"][0].response

        const p_banana = jsPsych.data.get().filter({label: 'p_banana'})["trials"][0].response
        const p_cookie = jsPsych.data.get().filter({label: 'p_cookie'})["trials"][0].response

        const data = jsPsych.data.get().filter({label: 'trial'})["trials"]

        const data_clean = []

        data_clean.push({
            ID: kid_info.ID,
            Age: kid_info.Age,
            Object: 'banana',
            trial_type: 'practice',
            response: p_banana,
            attr_category: 'n/a',
            attr_name:'n/a',
        })

        data_clean.push({
            ID: kid_info.ID,
            Age: kid_info.Age,
            Object: 'cookie',
            trial_type: 'practice',
            response: p_cookie,
            attr_category: 'n/a',
            attr_name:'n/a',
        })

        data.map((m)=>{
            let tmp_obj = {}
            tmp_obj.ID = kid_info.ID,
            tmp_obj.Age = kid_info.Age,
            tmp_obj.Object = m.Object
            tmp_obj.attr_category = m.attr_category
            tmp_obj.attr_name = m.attr_name
            tmp_obj.trial_type = m.adj_n
            tmp_obj.response = m.response

            data_clean.push(tmp_obj)
        })

        console.log(data_clean)

        console.log(data)
        sendDataToServer(data_clean)
    },
});

const timeline = [];

const info = {
    type: jsPsychSurveyText,
    preamble: "Enter relevant information below:",
    questions: [
        { prompt: "Subject ID:", name: "ID", required: true },
        { prompt: "Subject Age", name: "Age", required: true },
    ],
    button_label: ["Begin"],
    data: {
        label: 'info'}
};

const intro = {
    type: jsPsychHtmlButtonResponse,
    stimulus:
        `<p>In this game, youll learn about some things from an alien planet.` +
        ` But first, let's practice thinking about some things from planet Earth. Are you ready?</p>`,
    choices: ["Next"],
};

const practice_banana = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Let's think about all of the bananas in the world. How many bananas do you think are yellow?</p>`,
    choices: [
        `<img src = "img/banana_few.png" alt = 'banana_few' width="200px" height="200px"><p>few</p>`,
        `<img src = "img/banana_some.png" alt = 'banana_some' width="200px" height="200px"><p>some</p>`,
        `<img src = "img/banana_most.png" alt = 'banana_most' width="200px" height="200px"><p>most</p>`,
        `<img src = "img/banana_almost_all.png" alt = 'banana_almostall' width="200px" height="200px"><p>almost all</p>`,
    ],
    data:{
        label: 'p_banana'
    }
};

const practice_cookie = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>Let's think about all of the cookies in the world. How many cookies do you think are square?</p>`,
    choices: [
        `<img src = "img/cookie_few.png" alt = 'cookie_few' width="200px" height="200px"><p>few</p>`,
        `<img src = "img/cookie_some.png" alt = 'cookie_some' width="200px" height="200px"><p>some</p>`,
        `<img src = "img/cookie_most.png" alt = 'cookie_most' width="200px" height="200px"><p>most</p>`,
        `<img src = "img/cookie_almost_all.png" alt = 'cookie_almostall' width="200px" height="200px"><p>almost all</p>`,
    ],
    data:{
        label: 'p_cookie'
    }
};
const blip_intro = {
    on_start: function (trail) {
        const audio = new Audio("sound/tmp_sound.mp3");
        audio.addEventListener("error", function (event) {
            console.error("Error loading audio file:", event);
        });

        audio
            .play()
            .then(() => {
                console.log("Audio is playing");
            })
            .catch((error) => {
                console.error("Error playing audio:", error);
            });
    },
    type: jsPsychHtmlButtonResponse,
    stimulus: `<p>In this game, you'll learn about some things from an alien planet.
Blip the alien will show and talk about some things on her planet, and you'll make guesses about what those things are usually like.
Can you say hi to Blip?</p>
    <div class = "blip-intro-grid">
        <div></div>
        <img src="img/alien1.png" class="responsive max-width" alt="Alien Image" >
        <div class="image-container responsive">
            <img src="img/speechbubble.jpg" alt="Speech Bubble" class="responsive">
            <div class="overlay-text" id="overlay-text">
                "Hi, I'm Blip!"
            </div>
        </div>
        <div></div>
</div>`,
    choices: ["Next"],
};

const objs = []; // stores img path for all the stimulus
const props = []; // stores img path for all the options
const result = ["few", "some", "most", "almost_all"];

const attr = [
    { name: "blue", category: "color", index: 0 },
    { name: "red", category: "color", index: 1 },
    { name: "spotted", category: "pattern", index: 2 },
    { name: "striped", category: "pattern", index: 3 },
    { name: "tall", category: "body", index: 4 },
    { name: "wide", category: "body", index: 5 },
];
const obj_names = ["gade", "wug", "sprock", "modi", "toma", "blicket"];
for (let i = 1; i <= 6; i++) {
    let path = `img/objects/object${i}`;
    let prop_path = `img/prop_selection/object${i}`;
    let obj = [
        [`${path}_not_blue.PNG`, `${path}_blue.PNG`],
        [`${path}_not_red.PNG`, `${path}_red.PNG`],
        [`${path}_not_spotted.PNG`, `${path}_spotted.PNG`],
        [`${path}_not_striped.PNG`, `${path}_striped.PNG`],
        [`${path}_not_tall.PNG`, `${path}_tall.PNG`],
        [`${path}_not_wide.PNG`, `${path}_wide.PNG`],
    ];
    let prop = [];
    for (let j = 0; j < 6; j++) {
        let tmp_store = [];
        for (let r = 0; r < result.length; r++) {
            tmp_store.push(`${prop_path}_${attr[j].name}_${result[r]}.PNG`);
        }
        prop.push(tmp_store);
    }

    objs.push(obj);
    props.push(prop);
}

console.log(props);

/**
 * Preload an array of images
 * @param {Array} imgs
 * @returns jspsych preload objs
 */
const preload_res = (imgs) => {
    return {
        type: jsPsychPreload,
        images: imgs,
        show_detailed_errors: true,
        auto_preload: false,
        message: 'Loading, please wait...',
        show_progress_bar: true,
    };
};

/**
 * Create the selection frame
 * @param {Array} imgs array of each images for selection
 * @param {number} obj_index index of object
 * @param {number} attr_index index of attribute
 * @param {String} trial_type trial type for data storage
 * @returns
 */
const create_select = (imgs, obj_index, attr_index, trial_type) => {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `<p>Let's think about all of the ${obj_names[obj_index]}s on this planet. How many ${obj_names[obj_index]}s do you think are ${attr[attr_index].name}?</p>`,
        choices: imgs.map((i, index) => {
            return `<img src = "${i}" alt = 'cookie_few responsive' width="200px"><p>${result[index]}</p>`;
        }),
        data: {
            Object: `${obj_names[obj_index]}`,
            attr_category: `${attr[attr_index].category}`,
            attr_name: `${attr[attr_index].name}`,
            adj_n: `${trial_type}`,
            label: `trial`
        }
    };
};

/**
 * Create the small animation for each trial
 * @param {Array} frames array of objs representing each frame
 * @param {number} attr_1 order of stimulus image shown
 * @param {number} attr_2 order of stimulus image shown
 * @param {number} obj_index index of object
 * @param {number} attr_index index of attribute
 * @param {string} trial_type adj/n trial
 * @returns
 */
const create_muti_image = (
    frames,
    attr_1,
    attr_2,
    obj_index,
    attr_index,
    trial_type
) => {
    var res = {
        timeline: [
            {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: function () {
                    var current_frame = jsPsych.timelineVariable("images");
                    let show_image = jsPsych.timelineVariable("show_image");

                    const tran_pass = jsPsych.timelineVariable("tran_pass");
                    const statement_pass = jsPsych.timelineVariable("statement_pass");
                    let transition = `<div class = "grid-container">
                    <img src="img/alien1.png" class="responsive" alt="Alien Image">
                    <div class="image-container responsive fade-in-out">
                        <img src="img/speechbubble.jpg" alt="Speech Bubble" class="responsive">
                        <div class="overlay-text" id="overlay-text">
                            ${tran_pass
                            ? "Let's see what else I have"
                            : "Let's see what I have"
                        }
                        </div>
                    </div>
                    <img src="${current_frame[0]
                        }" class="stim fade-in-out" style="visibility: hidden" alt="Current Frame">
                </div>`;
                    let statement = "";
                    if (trial_type === "n") {
                        // noun
                        statement = `<div class = "grid-container">
            <img src="img/alien1.png" class="responsive">
            <div class="image-container responsive fade-in-out">
                <img src="img/speechbubble.jpg" alt="speech" class="responsive">
                <div class="overlay-text" id="overlay-text">${statement_pass
                                ? `It's a ${obj_names[obj_index]}`
                                : `It's a ${obj_names[obj_index]}`
                            }</div>
            </div>
            <img src="${current_frame[0]}" class="stim fade-in-out">
        </div>`;
                    } else {
                        // adj.
                        statement = `<div class = "grid-container">
            <img src="img/alien1.png" class="responsive">
            <div class="image-container responsive fade-in-out">
                <img src="img/speechbubble.jpg" alt="speech" class="responsive">
                <div class="overlay-text" id="overlay-text">${statement_pass
                                ? `It's a ${attr_2 === 0 ? "" : attr[attr_index].name} ${obj_names[obj_index]
                                }`
                                : `It's a ${attr_1 === 0 ? "" : attr[attr_index].name} ${obj_names[obj_index]
                                }`
                            }</div>
            </div>
            <img src="${current_frame[0]}" class="stim fade-in-out">
        </div>`;
                    }

                    if (!show_image) {
                        return transition;
                    }

                    return statement;
                },
                trial_duration: 100,
                on_start: function (trial) {
                    // console.log('triggered')
                    const audio = new Audio(jsPsych.timelineVariable("audio"));
                    audio.addEventListener("error", function (event) {
                        console.error("Error loading audio file:", event);
                    });

                    //   trial.trial_duration = audio.duration * 10000 + 5000;

                    audio
                        .play()
                        .then(() => {
                            console.log("Audio is playing");
                        })
                        .catch((error) => {
                            console.error("Error playing audio:", error);
                        });
                },
            },
        ],
        timeline_variables: frames,
    };
    return res;
};

// timeline.push(preload_data);
timeline.push(preload_res(props))
timeline.push(preload_res(objs))
timeline.push(info)
timeline.push(intro)
timeline.push(practice_banana)
timeline.push(practice_cookie);
timeline.push(blip_intro);

// order of objects
const obj_order = jsPsych.randomization.shuffle([0, 1, 2, 3, 4, 5]);
const attr_order = jsPsych.randomization.shuffle(attr);

// use to store attribute category that already had n/adj trials
let n_trial_set = new Set();
let adj_trial_set = new Set();

let numObj = objs.length - 1;
while (numObj >= 0) {
    // getting the random obj
    let obj_index = Number(obj_order[numObj]);

    let curr_attr = attr_order[numObj];
    // random select attribute
    let attr_index = curr_attr.index; // index of images
    let attr_img = objs[obj_index][attr_index];

    // console.log(attr_img)
    // timeline.push(preload_res(attr_img));

    // assemble animation
    let rand1 = Math.floor(Math.random() * 2);
    let rand2 = 1 - rand1;

    let frames = [
        {
            images: [attr_img[rand1]],
            audio: "sound/tmp_sound.mp3",
            tran_pass: false,
            statement_pass: false,
            show_image: false,
        },
        {
            images: [attr_img[rand1]],
            audio: "sound/tmp_sound.mp3",
            tran_pass: false,
            statement_pass: false,
            show_image: true,
        },
        {
            images: [attr_img[rand2]],
            audio: "sound/tmp_sound.mp3",
            tran_pass: true,
            statement_pass: false,
            show_image: false,
        },
        {
            images: [attr_img[rand2]],
            audio: "sound/tmp_sound.mp3",
            tran_pass: false,
            statement_pass: true,
            show_image: true,
        },
    ];

    let trial_type = jsPsych.randomization.sampleWithReplacement(
        ["n", "adj"],
        1
    )[0];
    // determine n./adj. trial
    if (trial_type === "n" && n_trial_set.has(curr_attr.category)) {
        trial_type = "adj";
    }

    if (trial_type === "adj" && adj_trial_set.has(curr_attr.category)) {
        trial_type = "n";
    }

    if (trial_type === "adj") {
        adj_trial_set.add(curr_attr.category);
    } else {
        n_trial_set.add(curr_attr.category);
    }

    // logging info about each trial
    console.log(`Trial_${5 - numObj}-------------------`);
    console.log("obj_index: " + obj_index);
    console.log("attr_index: " + attr_index);
    console.log(`Order of img: ${rand1}/${rand2}`);
    console.log(`Category & trial_type: ${curr_attr.category}:${trial_type}`);

    timeline.push(
        create_muti_image(frames, rand1, rand2, obj_index, attr_index, trial_type)
    );
    // timeline.push(preload_res(props[obj_index][attr_index]));
    timeline.push(
        create_select(props[obj_index][attr_index], obj_index, attr_index, trial_type)
    );

    numObj--;
}

jsPsych.run(timeline);
