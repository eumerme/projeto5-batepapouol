function openSidebar (sidebar){
    document.querySelector(".modal").classList.remove("hide");
}

function closeSidebar (sidebar) {
    document.querySelector(".modal").classList.add("hide");
}

function contactSelected (contact) {
    const check = contact.querySelector(".info-contact .check");
    const checkSelected = document.querySelector(".info-contact .check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}

function visibilitySelected (visibility) {
    const check = visibility.querySelector(".info-visibility .check");
    const checkSelected = document.querySelector(".info-visibility .check-selected");

    if (checkSelected !== null) {
        checkSelected.classList.remove("check-selected");
    }

    check.classList.add("check-selected");
}