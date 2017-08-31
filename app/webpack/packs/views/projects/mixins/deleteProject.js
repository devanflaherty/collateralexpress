const DeleteProject = {
  methods: {
    deletePrompt(id) {
      this.$store.dispatch({
        type: 'setReveal',
        reveal_type: 'delete',
        title: this.project.title,
        msg: 'Are you sure you want to delete this project?',
        pid: id
      })
    },
  }
}

export default DeleteProject
