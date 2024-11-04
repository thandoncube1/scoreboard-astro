import type { Meta, StoryObj } from "@storybook/react";

import { Button, type ButtonProps } from "./button";

const meta: Meta<ButtonProps> = {
    title: 'Button',
    component: Button,
    argTypes: {
        // 4. Update children to text
        children: {
            control: {
                type: "text",
            },
        },
        // Update variant and size to dropdown select
        variant: {
            options: ['primary', 'secondary', 'empty'],
            control: {
                type: "select"
            },
        },
        size: {
            options: ['sm', 'base'],
            control: {
                type: "select",
            },
        },
        disabled: {
            control: {
                type: "boolean",
            },
        },
    },
    // Define default props
    args: {
        variant: 'primary',
        size: 'base',
        children: 'Button',
        disabled: false
    }
}

export default meta;

type Story = StoryObj<typeof Button>;
export const Playground: Story = {
    args: {
        children: "This Is My Button"
    }
};