{
  const addtagButton = document.getElementById('addtag');
  const tagInput = document.getElementById('tagInput');
  const tagList = document.getElementById('tagList');
  const lableErr = document.getElementById('tag-error');
  addtagButton.addEventListener('click', function () {
    const tagValue = tagInput.value.trim();

    if (tagValue) {
      const li = document.createElement('span');
      li.className = 'badge-primary badge mx-1 ';
      lableErr.innerHTML = '';
      li.textContent = tagValue;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.className = 'btn btn-sm bg-transparent text-danger';
      removeButton.addEventListener('click', function () {
        li.remove();
      });
      li.appendChild(removeButton);
      tagList.appendChild(li);
      tagInput.value = '';
    }
  });

  document
    .getElementById('createPostForm')
    .addEventListener('submit', function (e) {
      e.preventDefault();

      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      const tags = Array.from(tagList.querySelectorAll('span')).map((li) =>
        li.textContent.slice(0, -1)
      );
      const post = '<%=post._id%>';
      if (tags == '') {
        lableErr.innerHTML = 'Please add atleast one lable..';
        return;
      }
      $.ajax({
        type: 'post',
        url: '/post/create',
        data: { title, content, tags, post },
        success: function (data) {
          console.log('data');
          console.log(data);
          window.location.href = '/';
        },
        error: function (err) {},
      });

      // Reset the form
      document.getElementById('postTitle').value = '';
      document.getElementById('postContent').value = '';

      tagInput.value = '';
      tagList.innerHTML = ''; // Clear the tag list

      // Close the modal

      $('#createPostModal').modal('hide');
    });

  $(document).ready(function () {
    // Handle click event on edit icon
    $('.edit-tag-icon').click(function () {
      var tagId = $(this).data('tag-id');
      var tagName = $(this).data('tag-name');
      var postId = $(this).data('post-id');
      console.log('ok');
      console.log(tagName);
      console.log(postId);

      // Populate the modal with the current tag name
      $('#editTagName').val(tagName);
      $('#updateTagButton').data('tag-id', tagId);
      $('#editTagForm').attr('action', `/post/${postId}/tags/${tagId}`);
    });

    // Handle click event on update button
  });
}
