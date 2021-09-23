export const componentDecorator = (href, text, key) => (
  <a
    href={href}
    key={key}
    target='_blank'
    rel='noreferrer'
    style={{ color: '#00A8E8', textDecoration: 'underline' }}
  >
    {text}
  </a>
);
