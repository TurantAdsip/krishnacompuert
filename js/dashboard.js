const form = document.getElementById("postForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const post = {

        title: document.getElementById("title").value,

        category: document.getElementById("category").value,

        date: document.getElementById("date").value,

        description: document.getElementById("description").value,

        image: document.getElementById("image").value,

        pdf: document.getElementById("pdf").value,

        apply: document.getElementById("apply").value

    };

    console.log(post);

    alert("Ready to Send");

}
);
