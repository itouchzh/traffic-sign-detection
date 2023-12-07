const requireAll = (requireContext: any) =>
    requireContext.keys().map(requireContext)
const svgList = require.context('../assets/icons', false, /\.svg$/)
requireAll(svgList)
export {}