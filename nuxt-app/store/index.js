export const state = () => ({
  planfixAccount: 'tagilcity',
  tabIndex: 0
})

export const mutations = {
  tabIndex: (state, newValue) => {
    state.tabIndex = newValue
  }
}