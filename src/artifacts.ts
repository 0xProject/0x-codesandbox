import { ContractArtifact } from 'ethereum-types';

import * as DummyERC20Token from './artifacts/DummyERC20Token.json';

export const artifacts = {
    DummyERC20Token: (DummyERC20Token as any) as ContractArtifact,
};
