import type { Meta, StoryObj } from "@storybook/react";

import { Avatar } from "./avatar";

const meta: Meta<typeof Avatar> = {
    title: 'Avatar',
    component: Avatar,
    argTypes: {},
    args: {}
}

export default meta;

type Story = StoryObj<typeof Avatar>;
export const Playground: Story = {};