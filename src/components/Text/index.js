function Text(props) {
  const { color, children } = props;

  return (
    <div color={color}>{children}</div>
  );
}

export default Text;
