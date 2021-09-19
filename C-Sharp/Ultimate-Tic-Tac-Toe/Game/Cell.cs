using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo.System;
using Ventillo.GameObjects;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal struct PickedNode
    {
        internal int nodeX;
        internal int nodeY;
        internal bool picked;

        internal PickedNode(int nodeX, int nodeY, bool picked)
        {
            this.nodeX = nodeX;
            this.nodeY = nodeY;
            this.picked = picked;
        }
    }
    internal class Cell : GridObject
    {
        internal List<List<Node>> nodes = new List<List<Node>>();
        MinMax cellMinMax;
        internal Cell(Vector position, MinMax cellMinMax, List<GameObject> gameObjects) : base(position)
        {
            this.cellMinMax = cellMinMax;
            borderSize = 1;

            var dist = new Vector(
                cellMinMax.Max.x - cellMinMax.Min.x,
                cellMinMax.Max.y - cellMinMax.Min.y
            );

            var minMax = new MinMax( //Scale the area of a cell to be 5% less on each side
                new Vector(cellMinMax.Min.x + (dist.x * 0.05), cellMinMax.Min.y + (dist.y * 0.05)),
                new Vector(cellMinMax.Max.x - (dist.x * 0.05), cellMinMax.Max.y - (dist.y * 0.05))
            );

            var xThird = (minMax.Max.x - minMax.Min.x) / 3;
            var yThird = (minMax.Max.y - minMax.Min.y) / 3;

            var minX = minMax.Min.x;
            var minY = minMax.Min.y;

            for (var xIndex = 0; xIndex < 3; xIndex++)
            {
                this.nodes.Add(new List<Node>());
                if (xIndex > 0)
                    minX = minX + xThird;
                else minX = minMax.Min.x;

                var maxX = minX + xThird;

                for (var yIndex = 0; yIndex < 3; yIndex++)
                {
                    if (yIndex > 0)
                        minY = minY + yThird;
                    else minY = minMax.Min.y;

                    var maxY = minY + yThird;

                    var nodePos = new Vector(
                        (minX + maxX) / 2,
                        (minY + maxY) / 2
                    );

                    var minMaxNode = new MinMax(new Vector(minX, minY), new Vector(maxX, maxY));

                    var node = new Node(nodePos, minMaxNode);
                    gameObjects.Add(node);
                    this.nodes[xIndex].Add(node);
                }
            }

            SetDrawObject(GenerateDrawObject(minMax));
        }

        internal List<List<Node>> GetCellNodes()
        {
            return nodes;
        }

        List<DrawObject> GenerateDrawObject(MinMax minMax)
        {
            var xThird = (minMax.Max.x - minMax.Min.x) / 3;
            var yThird = (minMax.Max.y - minMax.Min.y) / 3;

            var firstBarPos = this.ToLocalCoords(new Vector(
                minMax.Min.x + xThird,
                minMax.Min.y + yThird
            ));

            var secondBarPos = this.ToLocalCoords(new Vector(
                minMax.Max.x - xThird,
                minMax.Max.y - yThird
            ));

            var drawObjects = new List<DrawObject>()
            {
                new DrawObject(
                    new List<Vector>(){
                        this.ToLocalCoords(new Vector(minMax.Min.x, minMax.Min.y)),
                        this.ToLocalCoords(new Vector(minMax.Max.x, minMax.Min.y)),
                        this.ToLocalCoords(new Vector(minMax.Max.x, minMax.Max.y)),
                        this.ToLocalCoords(new Vector(minMax.Min.x, minMax.Max.y)),
                    },
                    new Color(225, 225, 225, 77),
                    new Color()
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(firstBarPos.x - this.borderSize, minMax.Min.y - this.Position.y),
                        new Vector(firstBarPos.x + this.borderSize, minMax.Min.y - this.Position.y),
                        new Vector(firstBarPos.x + this.borderSize, minMax.Max.y - this.Position.y),
                        new Vector(firstBarPos.x - this.borderSize, minMax.Max.y - this.Position.y),
                    },
                    new Color(234, 234, 234, 255),
                    new Color()
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(secondBarPos.x - this.borderSize, minMax.Min.y - this.Position.y),
                        new Vector(secondBarPos.x + this.borderSize, minMax.Min.y - this.Position.y),
                        new Vector(secondBarPos.x + this.borderSize, minMax.Max.y - this.Position.y),
                        new Vector(secondBarPos.x - this.borderSize, minMax.Max.y - this.Position.y),
                    },
                    new Color(234, 234, 234, 255),
                    new Color()
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(minMax.Min.x - this.Position.x, firstBarPos.y - this.borderSize),
                        new Vector(minMax.Max.x - this.Position.x, firstBarPos.y - this.borderSize),
                        new Vector(minMax.Max.x - this.Position.x, firstBarPos.y + this.borderSize),
                        new Vector(minMax.Min.x - this.Position.x, firstBarPos.y + this.borderSize),
                    },
                    new Color(234, 234, 234, 255),
                    new Color()
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(minMax.Min.x - this.Position.x, secondBarPos.y - this.borderSize),
                        new Vector(minMax.Max.x - this.Position.x, secondBarPos.y - this.borderSize),
                        new Vector(minMax.Max.x - this.Position.x, secondBarPos.y + this.borderSize),
                        new Vector(minMax.Min.x - this.Position.x, secondBarPos.y + this.borderSize),
                    },
                    new Color(234, 234, 234, 255),
                    new Color()
                ),
            };

            return drawObjects;
        }

        internal PickedNode SetDrawTypeForAI(int xIndex, int yIndex, string currentActivePlayer)
        {
            var pickedNode = new PickedNode(xIndex, yIndex, false);

            if (this.nodes.ElementAt(xIndex).ElementAt(yIndex).SetDrawType(currentActivePlayer))
            {
                CheckWinState(nodes);
                pickedNode.picked = true;
            }

            return pickedNode;
        }

        internal PickedNode HandleMouseEvents(Vector mouseClick, string currentActivePlayer)
        {
            var pickedNode = new PickedNode(-1, -1, false);

            if (this.active)
            {
                if (cellMinMax.PointIntersects(mouseClick))
                {
                    for (var xIndex = 0; xIndex < 3; xIndex++)
                    {
                        for (var yIndex = 0; yIndex < 3; yIndex++)
                        {
                            var node = nodes.ElementAt(xIndex).ElementAt(yIndex);

                            if (node.nodeMinMax.PointIntersects(mouseClick))
                            {
                                if (node.SetDrawType(currentActivePlayer))
                                {
                                    this.CheckWinState(nodes);
                                    pickedNode.nodeX = xIndex;
                                    pickedNode.nodeY = yIndex;
                                    pickedNode.picked = true;
                                }
                            }
                        }
                    }
                }
            }
            return pickedNode;
        }

        public override void Draw()
        {
            if (this.active || this.completed)
            {
                this.DrawByLine(this.DrawObjects.GetRange(0, 1));
            }
            this.DrawByLine(this.DrawObjects.GetRange(1, this.DrawObjects.Count - 1));
        }
    }
}
