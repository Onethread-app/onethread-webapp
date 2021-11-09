import Skeleton from '@material-ui/lab/Skeleton';

import { NameAvatar, SmallNameAvatar } from './TextAvatar.styles';

interface ITextAvatarProps {
  name: string;
}

const TextAvatar = (props: ITextAvatarProps) => {
  const { name } = props;

  return <NameAvatar>{name.slice(0, 1)}</NameAvatar>;
};

export const TextAvatarSkeleton = () => (
  <Skeleton width={40} height={40} />
);
export default TextAvatar;

export const SmallTextAvatar = (
  props: { bgColor?: string } & ITextAvatarProps,
) => {
  const { name, bgColor } = props;

  return <SmallNameAvatar bgColor={bgColor}>{name}</SmallNameAvatar>;
};
