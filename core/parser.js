/**
 * Created by Dzhambulat on 05.02.2015.
 */

function Parser(){

}

Parser.prototype.CFG={
    S:['S ST','ST'],
    ST:['EQ'],
    EQ:['id assigment AS'],
    AS:['E'],
    E:['T lpoperator E','T'],
    T:['( E )','T hpoperator T','number']
}

Parser.prototype.isTerminal=function(s)
{
    var fs=s.charCodeAt(0);
    if(fs>=97 && fs<=122)
    {
        return true;
    }
    else
    {
        return false;
    }
}

Parser.prototype.isInQueue=function(queue,elem)
{
    return queue.some(function(el)
    {
        if (el.pointIndex===elem.pointIndex &&
            el.products===elem.products)
        {
            return true;
        }
        else
        {
            return false;
        }
    })
}

Parser.prototype.first=function(nt)
{
    var cands=[];
    cands.push.apply(cands,this.CFG[nt]);
    var terms=[];

    while (cands.length>0)
    {
        var cand=cands[0];
        cands.splice(0,1);

        var fs=cand.charCodeAt(0);
        if(fs>=97 && fs<=122)
        {
            terms.push(cand[0].match(/([a-z]+)/)[1]); // get terminal
        }
        else
        {
            cands.unshift.apply(cands,this.CFG[cand[0]]);
        }
    }

    return terms;
}

Parser.prototype.closure=function(products,stateIndex)
{
    var e;
    var queue=[];
    var res=[];
    queue.push.apply(queue,products);
    res.push.apply(res,products);
    var isClosured=false;

    while (queue.length!=0)
    {
        var p=queue.shift();
        var point= p.pointIndex;
        var product= p.products.split(' ');

        if (p.pointIndex!=product.length && !this.isTerminal(product[point]))
        {

            var currentProduct=this.CFG[product[point]];

            for (var i in currentProduct)
            {
                e = {
                    pointIndex: 0,
                    products: currentProduct[i],
                    symbol: product[point],
                    'stateIndex': stateIndex
                };
                if(!this.isInQueue(res,e))
                {

                    isClosured=true;
                    queue.push(e);
                    res.push(e);
                }
            }
        }
    }

    if(!isClosured)
    {
        return null;
    }

    return res;
}

Parser.prototype.goto=function(products,symbol)
{
    var res=[];

    for (var i in products)
    {
        var p=products[i];
        var product= p.products.split(' ');
        if (product[p.pointIndex]===symbol)
        {
            res.push(
                {
                    pointIndex:p.pointIndex+1,
                    products: p.products,
                    symbol: p.symbol,
                    stateIndex: p.stateIndex
                }
            );
        }
    }

    return res;

}

Parser.prototype.reduce=function(product,stack)
{
    var node= {
        symbol:product.symbol,
        isToken: false
    }
    var presult=[];

    for (var i=0;i<product.pointIndex;i++)
    {
        var el=stack.pop();
        presult.unshift(el);
    }

    node.value=presult;

    return node;
}