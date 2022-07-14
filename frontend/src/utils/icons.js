import React from 'react';
import Icon from '@ant-design/icons';
import RectSvg from './icons/RectSvg';
import PolygonSvg from './icons/PolygonSvg';
import PointerSvg from './icons/PointerSvg';

export const RectIcon = props => <Icon component={RectSvg} {...props} />;

export const PolygonIcon = props => <Icon component={PolygonSvg} {...props} />;

export const PointerIcon = props => <Icon component={PointerSvg} {...props} />;
