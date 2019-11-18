import * as React from 'react';
import ContentLoader, { Rect, Circle } from 'react-content-loader/native';

const Loader = () => (
  <ContentLoader
    height={55}
    width={330}
    speed={0.75}
    primaryColor='#f3f3f3'
    secondaryColor='#ecebeb'>
    <Rect x='290' y='4' rx='4' ry='4' width='40' height='11' />
    <Rect x='5' y='48' rx='3' ry='3' width='49' height='11' />
    <Rect x='96' y='4' rx='3' ry='3' width='140' height='11' />
    <Rect x='96' y='44' rx='3' ry='3' width='100' height='11' />
    <Circle cx='30' cy='20' r='18' />
  </ContentLoader>
);

export default Loader;
