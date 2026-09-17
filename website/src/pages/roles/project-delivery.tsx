import type {ReactNode} from 'react';

import RolePathPage from '../../components/RolePathPage';
import {rolePathById} from '../../role-paths';

export default function ProjectDeliveryRole(): ReactNode {
  return <RolePathPage role={rolePathById['project-delivery']} />;
}
