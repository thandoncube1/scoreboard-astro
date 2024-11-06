import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
    title: 'Badge',
    component: Badge,
    argTypes: {},
    args: {}
}

export default meta;

type Story = StoryObj<typeof Badge>;
export const Playground: Story = {};