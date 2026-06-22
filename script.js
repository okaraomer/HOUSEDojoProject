// =========================
// Veriler
// =========================

let children = JSON.parse(localStorage.getItem("children")) || [];

let rules = JSON.parse(localStorage.getItem("rules")) || [
    {
        id: Date.now(),
        name: "Ödevini Tamamladı",
        points: 10
    },
    {
        id: Date.now() + 1,
        name: "Odasını Topladı",
        points: 5
    },
    {
        id: Date.now() + 2,
        name: "Yaramazlık",
        points: -5
    }
];

let rewardTarget =
    JSON.parse(localStorage.getItem("rewardTarget")) || 100;

// =========================
// Elementler
// =========================

const childNameInput = document.getElementById("childName");
const addChildBtn = document.getElementById("addChildBtn");

const ruleNameInput = document.getElementById("ruleName");
const rulePointsInput = document.getElementById("rulePoints");
const addRuleBtn = document.getElementById("addRuleBtn");

const childrenList = document.getElementById("childrenList");
const rulesList = document.getElementById("rulesList");

const rewardTargetInput = document.getElementById("rewardTarget");
const saveTargetBtn = document.getElementById("saveTargetBtn");
const targetDisplay = document.getElementById("targetDisplay");

// =========================
// Local Storage
// =========================

function saveData() {
    localStorage.setItem("children", JSON.stringify(children));
    localStorage.setItem("rules", JSON.stringify(rules));
    localStorage.setItem(
        "rewardTarget",
        JSON.stringify(rewardTarget)
    );
}

// =========================
// Çocuk Ekle
// =========================

function addChild() {
    const name = childNameInput.value.trim();

    if (!name) {
        alert("Çocuk adı giriniz.");
        return;
    }

    children.push({
        id: Date.now(),
        name,
        points: 0
    });

    childNameInput.value = "";

    saveData();
    renderChildren();
}

addChildBtn.addEventListener("click", addChild);

// =========================
// Kural Ekle
// =========================

function addRule() {
    const name = ruleNameInput.value.trim();
    const points = Number(rulePointsInput.value);

    if (!name) {
        alert("Kural adı giriniz.");
        return;
    }

    if (isNaN(points)) {
        alert("Puan giriniz.");
        return;
    }

    rules.push({
        id: Date.now(),
        name,
        points
    });

    ruleNameInput.value = "";
    rulePointsInput.value = "";

    saveData();
    renderRules();
    renderChildren();
}

addRuleBtn.addEventListener("click", addRule);

// =========================
// Çocuk Sil
// =========================

function deleteChild(id) {

    if (!confirm("Bu çocuğu silmek istiyor musunuz?")) {
        return;
    }

    children = children.filter(child => child.id !== id);

    saveData();
    renderChildren();
}

// =========================
// Kural Sil
// =========================

function deleteRule(id) {

    if (!confirm("Bu kuralı silmek istiyor musunuz?")) {
        return;
    }

    rules = rules.filter(rule => rule.id !== id);

    saveData();
    renderRules();
    renderChildren();
}

// =========================
// Puan Ver
// =========================

function applyRule(childId, rulePoints) {

    const child = children.find(
        c => c.id === childId
    );

    if (!child) return;

    child.points += rulePoints;

    saveData();
    renderChildren();
}

// =========================
// Hedef Puan
// =========================

function saveTarget() {

    const value = Number(
        rewardTargetInput.value
    );

    if (!value || value <= 0) {
        alert("Geçerli bir hedef puan giriniz.");
        return;
    }

    rewardTarget = value;

    targetDisplay.textContent =
        rewardTarget;

    rewardTargetInput.value = "";

    saveData();
    renderChildren();
}

saveTargetBtn.addEventListener(
    "click",
    saveTarget
);

// =========================
// Kuralları Göster
// =========================

function renderRules() {

    rulesList.innerHTML = "";

    if (rules.length === 0) {

        rulesList.innerHTML = `
            <div class="empty-message">
                Henüz kural eklenmedi.
            </div>
        `;

        return;
    }

    rules.forEach(rule => {

        const div = document.createElement("div");

        div.className = "rule-card";

        div.innerHTML = `
            <div>
                <div class="rule-name">
                    ${rule.name}
                </div>

                <div class="rule-points ${
                    rule.points >= 0
                        ? "rule-positive"
                        : "rule-negative"
                }">
                    ${rule.points > 0 ? "+" : ""}
                    ${rule.points}
                </div>
            </div>

            <button
                class="delete-btn"
                onclick="deleteRule(${rule.id})"
            >
                Sil
            </button>
        `;

        rulesList.appendChild(div);
    });
}

// =========================
// Çocukları Göster
// =========================

function renderChildren() {

    childrenList.innerHTML = "";

    targetDisplay.textContent =
        rewardTarget;

    if (children.length === 0) {

        childrenList.innerHTML = `
            <div class="empty-message">
                Henüz çocuk eklenmedi.
            </div>
        `;

        return;
    }

    children.forEach(child => {

        const rewardReached =
            child.points >= rewardTarget;

        const card =
            document.createElement("div");

        card.className = "child-card";

        let ruleButtons = "";

        rules.forEach(rule => {

            const positive =
                rule.points >= 0;

            ruleButtons += `
                <button
                    class="rule-btn ${
                        positive
                            ? "rule-btn-positive"
                            : "rule-btn-negative"
                    }"
                    onclick="applyRule(
                        ${child.id},
                        ${rule.points}
                    )"
                >
                    ${rule.name}
                    (${rule.points > 0 ? "+" : ""}
                    ${rule.points})
                </button>
            `;
        });

        card.innerHTML = `
            <div class="child-header">

                <div class="child-name">
                    ${child.name}
                </div>

                <div class="child-points">
                    ${child.points} Puan
                </div>

            </div>

            ${
                rewardReached
                ? `
                    <div class="reward-badge">
                        🎉 Ödül Kazandı
                    </div>
                `
                : ""
            }

            <div class="rule-buttons">
                ${ruleButtons}
            </div>

            <br>

            <button
                class="delete-btn"
                onclick="deleteChild(${child.id})"
            >
                Çocuğu Sil
            </button>
        `;

        childrenList.appendChild(card);
    });
}

// =========================
// Enter Tuşu
// =========================

childNameInput.addEventListener(
    "keypress",
    function (e) {
        if (e.key === "Enter") {
            addChild();
        }
    }
);

ruleNameInput.addEventListener(
    "keypress",
    function (e) {
        if (e.key === "Enter") {
            addRule();
        }
    }
);

rulePointsInput.addEventListener(
    "keypress",
    function (e) {
        if (e.key === "Enter") {
            addRule();
        }
    }
);

// =========================
// Başlat
// =========================

renderRules();
renderChildren();