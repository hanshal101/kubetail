// Copyright 2024 Andres Morey
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useSession } from '@/lib/auth';
import { useIsClusterAPIEnabled } from '@/lib/hooks';
import { mocks } from '@/mocks/console';
import Console from '@/pages/console';
import { renderElement } from '@/test-utils';

describe('console page', () => {
  it('blocks access if user is unauthenticated', () => {
    const history = createMemoryHistory();

    render(
      <Router location={history.location} navigator={history}>
        <Console />
      </Router>,
    );

    // assertions
    expect(history.location.pathname).toBe('/auth/login');
  });

  it('renders console UI if user is logged in and cluster API is enabled', async () => {
    // mock auth
    (useSession as Mock).mockReturnValue({
      session: { user: 'test' },
    });

    // mock cluster API enabled
    (useIsClusterAPIEnabled as Mock).mockReturnValue(true);

    const { getByText } = renderElement(<Console />, mocks);
    expect(getByText('Pods/Containers')).toBeInTheDocument();
  });
});
