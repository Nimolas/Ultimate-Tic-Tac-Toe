using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Ventillo.System;
using Ventillo.GameObjects;
using SFML.Graphics;
using SFML.System;
using Ventillo.Utils;
using Ventillo;

using Color = Ventillo.System.Color;

namespace Ultimate_Tic_Tac_Toe.Game
{
    internal class Node : GridObject
    {
        internal MinMax nodeMinMax;
        internal Node(Vector position, MinMax minMax) : base(position)
        {
            nodeMinMax = minMax;
            this.borderSize = 2;

            this.SetDrawObject(new List<DrawObject>(){
                new DrawObject(
                    new List<Vector>(){
                        new Vector(0, 0)
                    },
                    new Color(),
                    new Color()
                )
            });
        }

        List<DrawObject> GenerateCross(MinMax nodeMinMax)
        {
            nodeMinMax = new MinMax(
                ToLocalCoords(nodeMinMax.Min),
                ToLocalCoords(nodeMinMax.Max)
            );

            nodeMinMax = new MinMax(
                new Vector(nodeMinMax.Min.x * 0.7, nodeMinMax.Min.y * 0.7),
                new Vector(nodeMinMax.Max.x * 0.7, nodeMinMax.Max.y * 0.7)
            );

            var drawObjects = new List<DrawObject>(){
                new DrawObject(
                    new List<Vector>(){
                        new Vector(nodeMinMax.Min.x + this.borderSize, nodeMinMax.Min.y),
                        new Vector(nodeMinMax.Min.x, nodeMinMax.Min.y + this.borderSize),
                        new Vector(nodeMinMax.Max.x - this.borderSize, nodeMinMax.Max.y),
                        new Vector(nodeMinMax.Max.x, nodeMinMax.Max.y - this.borderSize),
                    },
                    new Color(139, 0, 0, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(nodeMinMax.Min.x + this.borderSize, nodeMinMax.Max.y),
                        new Vector(nodeMinMax.Min.x, nodeMinMax.Max.y - this.borderSize),
                        new Vector(nodeMinMax.Max.x - this.borderSize, nodeMinMax.Min.y),
                        new Vector(nodeMinMax.Max.x, nodeMinMax.Min.y + this.borderSize),
                    },
                    new Color(139, 0, 0, 255),
                    new Color(234, 234, 234, 255)
                )
            };

            return drawObjects;
        }

        List<DrawObject> GenerateNaught(MinMax nodeMinMax)
        {
            nodeMinMax = new MinMax(
                ToLocalCoords(nodeMinMax.Min),
                ToLocalCoords(nodeMinMax.Max)
            );

            nodeMinMax = new MinMax(
                new Vector(nodeMinMax.Min.x * .65, nodeMinMax.Min.y * .65),
                new Vector(nodeMinMax.Max.x * .65, nodeMinMax.Max.y * .65)
            );

            var dist = new Vector(
                nodeMinMax.Max.x - nodeMinMax.Min.x,
                nodeMinMax.Max.y - nodeMinMax.Min.y
            );

            var radius = dist.x < dist.y ? dist.x / 2 : dist.y / 2;

            var drawObjects = new List<DrawObject>(){
                new DrawObject(
                    new List<Vector>(){
                        new Vector(radius, radius)
                    },
                    new Color(23, 81, 126, 255),
                    new Color(234, 234, 234, 255)
                ),
                new DrawObject(
                    new List<Vector>(){
                        new Vector(radius * .85, radius * .85),
                    },
                    new Color(0, 0, 0, 255),
                    new Color(234, 234, 234, 255)
                )
            };

            return drawObjects;
        }

        internal void SetDrawObjectAI(string playerType)
        {
            if (playerType == "Cross")
            {
                SetDrawObject(GenerateCross(nodeMinMax));
            }
            else
            {
                SetDrawObject(GenerateNaught(nodeMinMax));
            }
        }

        internal bool SetDrawType(string currentActivePlayer)
        {
            if (this.drawType == "")
            {
                this.drawType = currentActivePlayer;


                if (this.drawType == "Cross")
                {
                    SetDrawObject(GenerateCross(nodeMinMax));
                }
                else
                {
                    SetDrawObject(GenerateNaught(nodeMinMax));
                }
                return true;
            }
            return false;
        }

        public override void Draw()
        {
            if (drawType == "Cross")
            {
                DrawByLine();
            }
            else if (drawType == "Naught")
            {
                DrawByCircle();
            }
        }
    }
}
