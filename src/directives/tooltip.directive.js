export default {
  bind(el, { value, options }) {
    M.Tooltip.init(el, { html: value, position: "top" });
  },
  unbind(el) {
    const tooltip = M.Tooltip.getInstance(el);
    if (tooltip && tooltip.destroy) {
      tooltip.destroy();
    }
  },
};
