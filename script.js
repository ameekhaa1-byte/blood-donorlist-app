// ================= FIREBASE SETUP =================

const firebaseConfig = {
  apiKey: "AIzaSyAy4cn8HAXUamiQhl_m5Ucg_YpXtXZ74q4",
  authDomain: "blood-donor-list-pazhur.firebaseapp.com",
  projectId: "blood-donor-list-pazhur",
  storageBucket: "blood-donor-list-pazhur.firebasestorage.app",
  messagingSenderId: "177307354378",
  appId: "1:177307354378:web:a8ea74e9e13537e03fe6f3",
  measurementId: "G-P5ZDRTV13M"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// ================= OPEN GROUP =================
function openGroup(group) {
    localStorage.setItem("selectedGroup", group);
    window.location.href = "donors.html";
}


// ================= ADD DONOR =================
function addDonor() {

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let blood = document.getElementById("blood").value;
    let donated = document.getElementById("donated").checked;

    if(name === "" || phone === "" || address === "" || blood === "") {
        alert("Please fill all fields");
        return;
    }

    db.collection("donors").add({
        name: name,
        phone: phone,
        address: address,
        blood: blood,
        donated: donated
    }).then(() => {
        alert("Donor Added Successfully!");
        window.location.href = "index.html";
    });
}


// ================= SHOW DONORS =================
window.onload = function() {

    if(document.getElementById("donorList")) {

        let group = localStorage.getItem("selectedGroup");
        document.getElementById("title").innerText = "Donors for " + group;

        db.collection("donors")
        .where("blood", "==", group)
        .onSnapshot(snapshot => {

            let list = document.getElementById("donorList");
            list.innerHTML = "";

            if(snapshot.empty){
                list.innerHTML = "<p>No donors available</p>";
                return;
            }

            snapshot.forEach(doc => {

                let d = doc.data();

                let status = d.donated ?
                    "<span style='color:green;'>✅ Donated</span>" :
                    "<span style='color:red;'>❌ Not Donated</span>";

                list.innerHTML += `
                    <div class="card">
                        <p><b>Name:</b> ${d.name}</p>
                        <p><b>Phone:</b>
                            <a href="tel:${d.phone}">${d.phone}</a>
                        </p>
                        <p><b>Address:</b> ${d.address}</p>
                        <p><b>Status:</b> ${status}</p>
                    </div>
                `;
            });

        });
    }
};
