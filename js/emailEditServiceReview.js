
document.addEventListener('DOMContentLoaded', () => {
    const btnUpdate = document.getElementById('submitButton');
    
    // CALL REFERRAL SERVICE ENDPOINT TO GET SERVICE ID


    let serviceId = serviceCard.dataset.id
    callServicePage(serviceId)

    // CALL ENPOINT TO UPDATE REFERRAL FORM
    btnUpdate.addEventListener('click', () => {
        const serviceCard = btnUpdate.closest('.service');
        let serviceId = serviceCard.dataset.id;
        callServicePage(serviceId);
    });
});

// Shows more information on a service by calling service.html  
function callServicePage (service_id) {
    fetchApi(`/add-monthly-view?service_id=${service_id}`)
    window.location.href = `emailEditServiceReview.html?id=${service_id}`;
}


