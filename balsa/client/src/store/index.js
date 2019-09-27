const state = {
  user: {},
  isSaving: false,
  isMoveDialogOpen: false,
  isExportFileDialogOpen: false,
  isFilePermissionDialogOpen : false,

  isRemoveFileDialogOpen : false,
  isRenameFileDialogOpen : false,

  file: { id: null },
};

const getters = {
  userInfo(state) {
    return state.user;
  },
  isSaving(state) {
    return state.isSaving;
  },
  isMoveDialogOpen(state) {
    return state.isMoveDialogOpen;
  },
  isExportFileDialogOpen(state, data) {
    return state.isExportFileDialogOpen;
  },
  isFilePermissionDialogOpen(state, data) {
    return state.isFilePermissionDialogOpen;
  },
  isRemoveFileDialogOpen(state, data) {
    return state.isRemoveFileDialogOpen;
  },
  isRenameFileDialogOpen(state, data) {
    return state.isRenameFileDialogOpen;
  },
  getFile(state) {
    return state.file;
  },
};

const mutations = {
  setUserInformation(state, data) {
    state.user = data;
  },
  setSavingState(state, data) {
    state.isSaving = data;
  },
  toggleMoveDialog(state, data) {
    if (data) {
      state.file = data;
    }
    state.isMoveDialogOpen = !state.isMoveDialogOpen;
  },
  toggleExportFileDialog(state, data) {
    state.isExportFileDialogOpen = !state.isExportFileDialogOpen;
  },
  toggleFilePermissionDialog(state, data) {
    state.isFilePermissionDialogOpen = !state.isFilePermissionDialogOpen;
  },

  toggleRemoveFileDialog(state, data) {
    state.isRemoveFileDialogOpen = !state.isRemoveFileDialogOpen;
  },

};

const actions = {
  saveUserInformation(context, data) {
    context.commit('setUserInformation', data);
  },
  updateSavingState(context, data) {
    context.commit('setSavingState', data);
  },
  toggleMoveDialog(context, data) {
    context.commit('toggleMoveDialog', data);
  },
  toggleExportFileDialog(context, data) {
    context.commit('toggleExportFileDialog', data);
  },
  toggleFilePermissionDialog(context, data) {
    context.commit('toggleFilePermissionDialog', data);
  },
  toggleRemoveFileDialog(context, data) {
    context.commit('toggleRemoveFileDialog', data);
  },
  toggleRenameFileDialog(context, data) {
    context.commit('toggleRenameFileDialog', data);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
