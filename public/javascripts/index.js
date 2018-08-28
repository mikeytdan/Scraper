$(document).ready(function () {

    $('.btn-article-save').on('click', function (event) {
        event.preventDefault();
        var headline = $(this).attr("data-title");
        var summary = $(this).attr("data-content");
        var url = $(this).attr("data-link");

        var article = {
            headline: headline,
            summary: summary,
            url: url
        }

        $.ajax({
            method: "POST",
            url: "/save",
            data: article
        }).then(function (data) {
            console.log("Repsonse: " + JSON.stringify(data, 0, 2));
            alert("Saved!");
        });
    });

    $('.btn-article-delete').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr("data-id");

        var article = {
            id: id
        }

        $.ajax({
            method: "POST",
            url: "/deleteArticle",
            data: article
        }).then(function (data) {
            window.location = window.location;
        });
    });

    $('.btn-add').on('click', function (event) {
        event.preventDefault();
        var id = $(this).attr("data-id");
        var value = $(this).closest("form").find("input[name='add-comment']").val();

        var comment = {
            id: id,
            text: value
        }

        $.ajax({
            method: "POST",
            url: "/addComment",
            data: comment
        }).then(function (data) {
            window.location = window.location;
        });
    });


    $('.btn-comment-delete').on('click', function (event) {
        event.preventDefault();
        var articleID = $(this).attr("data-article-id");
        var commentID = $(this).attr("data-comment-id");

        var comment = {
            articleID: articleID,
            commentID: commentID,
        }

        console.log(JSON.stringify(comment, 0, 2));

        // return;
        $.ajax({
            method: "POST",
            url: "/deleteComment",
            data: comment
        }).then(function (data) {
            window.location = window.location;
        });
    });

});