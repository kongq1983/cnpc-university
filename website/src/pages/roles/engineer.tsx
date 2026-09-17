import type {ReactNode} from 'react';

import RolePathPage from '../../components/RolePathPage';
import {rolePathById} from '../../role-paths';

export default function EngineerRole(): ReactNode {
  return <RolePathPage role={rolePathById.engineer} />;
}
